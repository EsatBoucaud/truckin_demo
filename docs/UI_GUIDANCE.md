# UI Guidance

This repository now includes `https://github.com/cyxzdev/Uncodixfy` as a Git submodule at:

- `C:\Users\esatb\OneDrive\Documents\truckin\references\Uncodixfy`

Pulled commit:

- `de11774974165ed45a09f1a40b95d13994939992`

Fresh checkouts should initialize the reference with:

```powershell
git submodule update --init --recursive
```

## What It Is

`Uncodixfy` is not a component framework. It is a rule set for avoiding generic AI-generated UI patterns such as:

- oversized rounded corners
- floating glass panels
- decorative hero copy inside dashboards
- gradient-heavy dark SaaS styling
- filler KPI cards, fake charts, and ornamental badges

Primary source files:

- `references/Uncodixfy/Uncodixfy.md`
- `references/Uncodixfy/SKILL.md`

## How We Should Use It Here

When building new UI in this repo:

1. Start from the existing project structure and MUI theme instead of restyling from scratch.
2. Use `Uncodixfy` to remove default AI UI habits before writing components.
3. Preserve simple layout decisions: fixed navigation when needed, ordinary headers, clear forms, restrained cards, and functional tables.
4. Reuse the existing theme colors before proposing a new palette.

Current project palette sources:

- `dashdarkx-v1.0.0 (1)/src/theme/colors.ts`
- `dashdarkx-v1.0.0 (1)/src/theme/palette.ts`

Notable current-theme constraints:

- Primary already centers on purple (`purple[500]` / `#CB3CFF`)
- Secondary already uses cyan and blue accents
- Text and surface tokens already exist and should be preferred over ad hoc color picks

## Practical Checklist For New Screens

- Use simple section structure with clear headings and real content.
- Keep border radii in a restrained range, normally `8px` to `10px`.
- Favor borders and contrast over heavy shadows.
- Avoid decorative uppercase eyebrow labels and marketing copy in application screens.
- Avoid fake analytics blocks unless the feature genuinely needs them.
- Keep tables, filters, and forms plain and readable.
- On mobile, adapt layouts intentionally instead of stacking everything into a single long column without prioritization.

## Updating The Reference

Run:

```powershell
git -C references/Uncodixfy pull --ff-only
```

If the upstream rules change materially, update `AGENTS.md` as well so future UI tasks inherit the revised guidance automatically.
