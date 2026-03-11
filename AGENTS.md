# UI Build Guidance

Use `references/Uncodixfy/Uncodixfy.md` as the default style guardrail for any new frontend work in this repository.

## Default Rules For UI Tasks

- Treat `Uncodixfy` as an anti-pattern list first: avoid generic AI UI moves before adding visual flourishes.
- Reuse this project's existing palette before introducing new colors. Read:
  - `dashdarkx-v1.0.0 (1)/src/theme/colors.ts`
  - `dashdarkx-v1.0.0 (1)/src/theme/palette.ts`
- Stay inside the current stack and patterns when possible: React, Vite, TypeScript, and MUI theme tokens already used by the app.
- Keep surfaces solid and grounded. No floating glass panels, decorative gradients, or detached shells unless explicitly requested.
- Keep radii restrained. Default target is `8px` to `10px`; do not spread large rounded corners across the UI.
- Use straightforward information architecture: simple headers, functional sidebars, normal spacing, and clear content hierarchy.
- Do not add hero sections, eyebrow labels, decorative status blurbs, fake analytics, or filler charts to internal product UI.
- Prefer subtle borders and restrained shadows over glow, blur, or "premium dashboard" styling.
- Do not invent a new font stack casually. If typography changes are needed, make them deliberate and consistent across the feature.

## Working Rule

If a design choice feels like the easiest "AI-generated dashboard" move, reject it and choose the cleaner, more product-specific option.

## Reference Maintenance

- Upstream reference submodule: `references/Uncodixfy`
- Initialize after clone with: `git submodule update --init --recursive`
- Refresh it with: `git -C references/Uncodixfy pull --ff-only`
