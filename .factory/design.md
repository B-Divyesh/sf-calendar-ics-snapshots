# Calendar Snapshotter — visual thesis

## Direction

**Monochrome typographic broadsheet.** A calendar snapshot is a record, so the product looks like a carefully indexed late-edition newspaper rather than another pastel planner. Oversized issue numbers, datelines, hairline rules, terse deck copy, and ledger-like event rows make change history feel inspectable and durable. The interface remains a tool: illustration establishes the idea once, while operational screens defer to dates and events.

## Palette

The palette comes from carbon ink, uncoated newsprint, proof marks, and archive boxes. It is intentionally single-mode; painting the off-white ground consistently is part of the thesis.

| Token | Value | Use |
| --- | --- | --- |
| Paper | `#f3f0e8` | App and site background |
| Sheet | `#fffdf7` | Raised working surfaces |
| Ink | `#171713` | Primary text and strong rules |
| Quiet ink | `#5b5a52` | Secondary copy (7.0:1 on paper) |
| Carbon | `#292925` | Buttons and navigation |
| Proof red | `#9e2f28` | Changed/cancelled marks, focus accents |
| Ledger green | `#276148` | Added/restored confirmation |
| Amber | `#735214` | Warning and offline status |

No gradients. Status always pairs color with a word or symbol. Focus uses a 3 px proof-red outline plus offset and therefore remains legible without relying on fill color.

## Typography

- **Display/editorial:** Georgia, `Times New Roman`, serif. It gives mastheads and snapshot dates the authority of a printed record without a font download.
- **Operational:** ui-monospace, SFMono-Regular, Menlo, Consolas, monospace. It makes timestamps, UIDs, counts, and diffs align like a ledger.
- Scale: 14 / 16 / 20 / 28 / 44 / clamp(56–112) px. Body is at least 16 px. Reading measure is capped at 68 characters; data uses tabular figures.

System families are deliberate: zero font payload, privacy-safe, and native rendering on every supported desktop.

## Spacing and composition

An 8 px base rhythm with 4 px micro-spacing. Major editorial bands use 24, 40, 64, and 96 px. Pages use a centered 1200 px sheet and a responsive 12-column grid. The desktop app uses a narrow ledger rail plus a broad reading pane. At 390 px the rail becomes a top index; secondary explanatory copy drops, controls stack, and event rows become one-column without losing actions.

Rules group related material only. Boxes are reserved for genuinely independent objects: vault unlock, individual connection, and restore basket. Buttons and fields are at least 44 px high with 8 px separation.

## Interaction grammar

- Primary actions are solid-carbon rectangles with literal verbs: “Take snapshot”, “Export 3 events”.
- Secondary actions resemble newspaper folio links: underlined on hover, bounded when they need a touch target.
- Selection uses a proof mark in the left margin and a persistent restore count.
- Destructive actions name the target and require confirmation; imports and snapshots give immediate live-region feedback.
- Loading uses the word “Recording…” with a quiet progress rule. Empty, offline, locked, and error states each include the next useful action.

## Motion policy

Motion is editorial and finite: a new snapshot row enters with a 180 ms downward settle and change counts reveal with a 220 ms opacity transition. Buttons depress by 1 px. Nothing loops. With `prefers-reduced-motion: reduce`, transitions and transforms are removed and state changes are instantaneous; hierarchy remains through type, rules, and placement.

## Asset plan and prompt sheet

One generated editorial hero plate clarifies the product: a top-down archive desk where translucent calendar leaves reveal successive edits, secured by a small physical lock and indexed with blank tabs. It is an atmospheric metaphor, not a fake UI. UI icons and proof marks are hand-authored CSS/SVG geometric forms.

**Art direction prompt:**

> Use case: stylized-concept. Asset type: wide landing-page editorial hero plate. Primary request: top-down still life of overlapping translucent calendar pages recording the same week at different moments, one appointment visibly shifted through the layers, with a small matte-black archival lock and blank index tabs. Scene/backdrop: uncoated warm newsprint desk. Style/medium: refined monochrome cut-paper editorial collage with subtle halftone and photogravure texture. Composition: wide 3:2 frame, subjects concentrated center-right with breathing room, crisp page edges. Lighting: raking window light, quiet archival mood. Palette: bone paper, carbon black, charcoal grey, one restrained oxblood proof mark. Materials: paper fibre, tracing vellum, stamped ink, blackened steel. Constraints: no readable text, no interface screenshot, no people, no logos, no watermark. Avoid: gradients, glossy 3D, blue tech glow, colorful stationery, distorted calendars, brand symbols.

Generated with the factory image model (`factory-image`, Azure AI Foundry) on 2026-08-28. Original project asset; no third-party source material. The accepted source and its exact prompt sidecar live in `assets/src/`; optimized WebP and AVIF derivatives ship in the site.

## Why it fits

Calendar providers present the current truth; Snapshotter preserves editions. A broadsheet’s hierarchy—edition, dateline, corrections, archive—maps directly onto snapshots, diffs, and recovery. The result is recognizable before the logo appears and keeps dense calendar changes calm enough to scan under pressure.
