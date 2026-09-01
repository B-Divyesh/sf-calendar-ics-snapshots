export type Snapshot = {
  id: string;
  createdAt: string;
  source: "file" | "caldav";
  sourceName: string;
  ics: string;
  fingerprint: string;
};

export type Schedule = "manual" | "15m" | "hourly" | "daily";

export type Connection = {
  url: string;
  username: string;
  password: string;
  schedule: Schedule;
  lastRun?: string;
};

export type VaultData = {
  version: 1;
  snapshots: Snapshot[];
  connection?: Connection;
};

type Envelope = { version: 1; salt: string; iv: string; data: string };
export type EncryptedArchive = {
  format: "calendar-snapshotter-encrypted-archive";
  version: 1;
  exportedAt: string;
  envelope: Envelope;
};

let databaseName = "calendar-snapshotter";
const openDatabases = new Set<IDBDatabase>();
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const bytesToBase64 = (bytes: Uint8Array) => btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
const base64ToBytes = (value: string) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore("vault");
    request.onsuccess = () => {
      const db = request.result;
      openDatabases.add(db);
      db.onversionchange = () => {
        db.close();
        openDatabases.delete(db);
      };
      resolve(db);
    };
    request.onerror = () => reject(request.error);
  });
}

/** Selects the independent demo vault before any vault operation starts. */
export function configureVaultStorage(name: string): void {
  databaseName = name;
}

export async function removeVaultStorage(): Promise<void> {
  for (const db of openDatabases) db.close();
  openDatabases.clear();
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(databaseName);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("Close the other Calendar Snapshotter window before resetting the demo."));
  });
}

async function getEnvelope(): Promise<Envelope | undefined> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("vault", "readonly");
    const request = transaction.objectStore("vault").get("primary");
    request.onsuccess = () => {
      db.close();
      openDatabases.delete(db);
      resolve(request.result as Envelope | undefined);
    };
    request.onerror = () => {
      db.close();
      openDatabases.delete(db);
      reject(request.error);
    };
  });
}

async function setEnvelope(value: Envelope): Promise<void> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("vault", "readwrite");
    transaction.objectStore("vault").put(value, "primary");
    transaction.oncomplete = () => {
      db.close();
      openDatabases.delete(db);
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      openDatabases.delete(db);
      reject(transaction.error);
    };
  });
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey("raw", encoder.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations: 310_000 },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function openEnvelope(passphrase: string, envelope: Envelope): Promise<Vault> {
  try {
    const salt = base64ToBytes(envelope.salt);
    const key = await deriveKey(passphrase, salt);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64ToBytes(envelope.iv) }, key, base64ToBytes(envelope.data));
    const data = JSON.parse(decoder.decode(plain)) as VaultData;
    if (data.version !== 1 || !Array.isArray(data.snapshots)) throw new Error("Unknown vault format");
    return new Vault(key, salt, data);
  } catch {
    throw new Error("The passphrase did not unlock this encrypted archive.");
  }
}

export class Vault {
  #key: CryptoKey;
  #salt: Uint8Array;
  data: VaultData;

  constructor(key: CryptoKey, salt: Uint8Array, data: VaultData) {
    this.#key = key;
    this.#salt = salt;
    this.data = data;
  }

  static async exists(): Promise<boolean> {
    return Boolean(await getEnvelope());
  }

  static async create(passphrase: string): Promise<Vault> {
    if (passphrase.length < 10) throw new Error("Use at least 10 characters for the vault passphrase.");
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const vault = new Vault(await deriveKey(passphrase, salt), salt, { version: 1, snapshots: [] });
    await vault.save();
    return vault;
  }

  static async createWithData(passphrase: string, data: VaultData): Promise<Vault> {
    if (passphrase.length < 10) throw new Error("Use at least 10 characters for the vault passphrase.");
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const vault = new Vault(await deriveKey(passphrase, salt), salt, data);
    await vault.save();
    return vault;
  }

  static async open(passphrase: string): Promise<Vault> {
    const envelope = await getEnvelope();
    if (!envelope) throw new Error("No local vault exists yet.");
    try { return await openEnvelope(passphrase, envelope); }
    catch { throw new Error("The passphrase did not unlock this vault."); }
  }

  async save(): Promise<void> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, this.#key, encoder.encode(JSON.stringify(this.data)));
    await setEnvelope({ version: 1, salt: bytesToBase64(this.#salt), iv: bytesToBase64(iv), data: bytesToBase64(new Uint8Array(cipher)) });
  }
}

export async function exportEncryptedArchive(): Promise<string> {
  const envelope = await getEnvelope();
  if (!envelope) throw new Error("There is no local archive to export.");
  const archive: EncryptedArchive = {
    format: "calendar-snapshotter-encrypted-archive",
    version: 1,
    exportedAt: new Date().toISOString(),
    envelope
  };
  return JSON.stringify(archive, null, 2);
}

export async function importEncryptedArchive(passphrase: string, raw: string): Promise<Vault> {
  let archive: EncryptedArchive;
  try {
    archive = JSON.parse(raw) as EncryptedArchive;
    if (archive.format !== "calendar-snapshotter-encrypted-archive" || archive.version !== 1 || archive.envelope?.version !== 1) {
      throw new Error("format");
    }
  } catch {
    throw new Error("Choose a Calendar Snapshotter encrypted archive file.");
  }
  const imported = await openEnvelope(passphrase, archive.envelope);
  await setEnvelope(archive.envelope);
  return imported;
}

export async function fingerprint(value: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(value.replace(/DTSTAMP:[^\r\n]*/gi, "DTSTAMP:")));
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
