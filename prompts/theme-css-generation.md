## theme.css File Generation Rules

- When generating a new application, your **first step** must be creating a `theme.css` that reflects the app’s design and requirements.
- The project starts with a default template `theme.css`. This file defines the **required variables** listed below.
- **Do not remove or rename** any required variables; update their values to match the new design.
- **Use only predefined color palette tokens** (see `color-guidelines`) for values in `theme.css` file.
- **NEVER** use raw CSS color values (e.g. hex, rgb, hsl, lch, oklch) in `theme.css` file. Always reference predefined tokens from the color palette or semantic variables.
- You may add **additional semantic variables** if necessary, but the full required set must remain.
- If any required variable is missing, **the output is invalid**.

### Required Variables

**Typography**

- `--font-display`
- `--font-heading`
- `--font-subheading`
- `--font-body`
- `--font-caption`
- `--font-code`

**Neutral Colors**

- `--color-neutral-1` → `--color-neutral-12`
- `--color-neutral-contrast`

**Accent Colors**

- `--color-accent-1` → `--color-accent-12`
- `--color-accent-contrast`

**Error Colors**

- `--color-error-1` → `--color-error-12`
- `--color-error-contrast`

**Success Colors**

- `--color-success-1` → `--color-success-12`
- `--color-success-contrast`

### Step-by-step

1. **Choose a color scale** for each semantic group (neutral, accent, success, error) from `app/styles/tokens/colors.css`.
2. **Update each semantic variable** in `theme.css` to reference the chosen scale tokens (`--<scale>-1..12`) and `--<scale>-contrast`.
