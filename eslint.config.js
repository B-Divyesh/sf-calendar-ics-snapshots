import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "src-tauri/target/**"] },
  {
    files: ["scripts/**/*.{js,mjs,ts}", "tests/**/*.ts"],
    languageOptions: {
      globals: { Buffer: "readonly", console: "readonly", process: "readonly", URL: "readonly" }
    }
  },
  js.configs.recommended,
  ...tseslint.configs.recommended
);
