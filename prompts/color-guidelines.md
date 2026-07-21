# Colors

## Available Color Scales

The project includes a set of carefully designed color scales with 12 steps each (dominant color shown in parentheses):

### Gray Scales

- gray (#8d8d8d)
- mauve (#8e8c99)
- slate (#8b8d98)
- sage (#868e8b)
- olive (#898e87)
- sand (#8d8d86)

### Accent Scales

- Reds
  - tomato (#e54d2e)
  - red (#e5484d)
  - ruby (#e54666)
  - crimson (#e93d82)

- Purples
  - pink (#d6409f)
  - plum (#ab4aba)
  - purple (#8e4ec6)
  - violet (#6e56cf)
  - iris (#5b5bd6)
  - indigo (#3e63dd)

- Blues
  - blue (#0090ff)
  - cyan (#00a2c7)
  - sky (#7ce2fe)

- Greens
  - teal (#12a594)
  - jade (#29a383)
  - green (#30a46c)
  - grass (#46a758)
  - lime (#bdee63)
  - mint (#86ead4)

- Browns
  - bronze (#a18072)
  - gold (#978365)
  - brown (#ad7f58)
  - orange (#f76b15)

- Yellows
  - amber (#ffc53d)
  - yellow (#ffe629)

## Scale Structure

Each scale has 12 steps, running from lightest → dominant → darkest.

Typical usage:

- Steps 1-2: Subtle backgrounds, barely visible tints
- Steps 3-5: UI element backgrounds (hover states, disabled states)
- Steps 6-8: Borders, dividers
- Step 9: The scale's dominant color
- Step 10: Hover/pressed states for step 9
- Steps 11-12: High contrast text on light backgrounds

In dark mode, scales are automatically reversed (dark → light), the dominant color (step 9) remains consistent.

Scales are defined in `app/styles/tokens/colors.css`. Example: `--indigo-7: light-dark(#abbdf9, #3a4f97)`. The `colors.css` file is large, do not read it directly, as it will pollute your context.

Each scale also has an associated contrast color to ensure text readability on the dominant color (e.g., `--indigo-contrast` text on `--indigo-9` background).

## Semantic Colors

The components typically use semantic variables (defined in `app/styles/theme.css`) that reference the raw color scales:

- `--color-neutral-[1-12]` (one of the gray scales)
- `--color-accent-[1-12]` (project's primary brand color)
- `--color-success-[1-12]`
- `--color-error-[1-12]`

You must update these semantic variables to match the intended mood and visual style of the project.

## Guidelines for Using Colors

When selecting colors, you may:

- Introduce additional semantic variables.
- Reassign which semantic variables are used in specific components.
- Reference non-semantic variables directly within component CSS files.
- Use hardcoded colors where appropriate.

Visual quality takes priority over strict consistency.
