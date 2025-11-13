# Design System

## Theme

- Global theme file: `/app/styles/theme.css`
- Prefer existing tokens from `/app/styles/tokens/`
- If needed, extend by:
  - Adding new variables in `theme.css`
  - Defining component-level styles
  - Using inline values (last resort)

## Media

- Use royalty-free sources:
  - https://unsplash.com
  - https://pexels.com
  - https://pixabay.com
- Choose visuals that match the app’s domain (e.g. travel, products, people)

## Style Guide

### Global Tokens

- Spacing: `--space-[1-9]` → 4px–64px
- Radius: `--radius-[1-6]` → 2px–12px, plus `--radius-round`
- Border sizes: `--border-size-[1-5]` → 1px–25px
- Shadows: `--shadow-[1-4]`, `--inner-shadow-[1-4]`
- Shadow config: `--shadow-color`, `--shadow-strength`
- Easings: `--ease`, `--ease-in`, `--ease-out`, `--ease-in-out`, plus bounce variants
- Animations: `--animation-fade-[in|out]`, `--animation-scale-[up|down]`, `--animation-spin`, `--animation-blink`, `--animation-bounce`

### Usage Notes

- Use tokens whenever possible before defining new values.
- Keep styles consistent with theme.css.
