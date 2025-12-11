# Apple Design System Tokens

This document outlines all CSS custom properties (variables) available from the Apple Design System extracted from apple.com/newsroom.

## Color Tokens

### Primary Colors
- `--color-primary-dark`: #1d1d1f (Dark text/elements)
- `--color-primary-black`: #000000 (Pure black)
- `--color-primary-white`: #ffffff (Pure white)
- `--color-primary-light`: #f5f5f7 (Light background)

### Secondary Colors
- `--color-secondary-light`: #e8e8ed (Light dividers/borders)
- `--color-gray`: #6e6e73 (Gray text/icons)

### Accent Colors
- `--color-accent-blue`: #0066cc (Primary interactive color)
- `--color-accent-blue-light`: #0071e3 (Hover state)

### Semantic Colors
- `--color-semantic-primary`: #f5f5f7 (Primary semantic background)
- `--color-semantic-secondary`: #e8e8ed (Secondary semantic background)
- `--color-semantic-focus`: #0071e3 (Focus indicator color)

## Typography Tokens

### Font Families
- `--font-display`: "SF Pro Display" (Headings, large text)
- `--font-text`: "SF Pro Text" (Body text, UI elements)
- `--font-system`: System font stack (Fallback)

### Font Sizes
- `--font-size-h1-large`: 2.13rem (34px)
- `--font-size-h1-display`: 2rem (32px)
- `--font-size-h1-medium`: 1.59rem (25.5px)
- `--font-size-h1-small`: 1.5rem (24px)
- `--font-size-h2`: 1.31rem (21px)
- `--font-size-button-large`: 1.75rem (28px)
- `--font-size-button-normal`: 1.13rem (18px)
- `--font-size-body`: 1rem (16px)
- `--font-size-small`: 0.875rem (14px)
- `--font-size-caption`: 0.75rem (12px)

### Font Weights
- `--font-weight-light`: 300
- `--font-weight-regular`: 400
- `--font-weight-medium`: 500
- `--font-weight-semibold`: 600
- `--font-weight-bold`: 700

### Line Heights
- `--line-height-tight`: 1.13
- `--line-height-normal`: 1.42
- `--line-height-relaxed`: 1.47
- `--line-height-body`: 1.5
- `--line-height-loose`: 1.6

### Letter Spacing
- `--letter-spacing-tight`: -0.374px
- `--letter-spacing-normal`: 0
- `--letter-spacing-wide`: 0.231px

## Spacing Scale

- `--spacing-xs`: 4px
- `--spacing-sm`: 8px
- `--spacing-md`: 12px
- `--spacing-lg`: 16px
- `--spacing-xl`: 20px
- `--spacing-2xl`: 24px
- `--spacing-3xl`: 32px
- `--spacing-4xl`: 40px
- `--spacing-5xl`: 48px
- `--spacing-6xl`: 64px

## Border Radius

- `--border-radius-xs`: 2px
- `--border-radius-sm`: 4px
- `--border-radius-md`: 8px
- `--border-radius-lg`: 12px
- `--border-radius-xl`: 16px
- `--border-radius-full`: 50%

## Shadow System

- `--shadow-sm`: 0 1px 3px rgba(0, 0, 0, 0.12)
- `--shadow-md`: 0 4px 12px rgba(0, 0, 0, 0.15)
- `--shadow-lg`: 0 8px 24px rgba(0, 0, 0, 0.18)
- `--shadow-focus`: 0 0 0 2px #0071e3
- `--shadow-button-focus`: rgba(0, 0, 0, 0.2) 0px 0px 16px 0px

## Interactive States

### Focus Indicator
- `--focus-outline`: 2px solid var(--color-semantic-focus)
- `--focus-outline-offset`: 2px

## Transitions

- `--transition-fast`: 100ms ease-out
- `--transition-normal`: 200ms ease-out
- `--transition-slow`: 300ms ease-out

## Opacity

- `--opacity-hover`: 0.16
- `--opacity-active`: 1
- `--opacity-disabled`: 0.5

## Responsive Breakpoints

The design system includes responsive styles at the following breakpoints:
- 1632px: Large desktop
- 1440px: Standard desktop (media query adjustments)
- 1068px: Tablet landscape (heading size reduction)
- 833px: Tablet (single column layout)
- 767px: Mobile landscape
- 480px: Mobile portrait (full-width buttons)

## Usage Examples

### Using Color Variables
```css
.button {
  background-color: var(--color-accent-blue);
  color: var(--color-primary-white);
}

.button:hover {
  background-color: var(--color-accent-blue-light);
}
```

### Using Typography Variables
```css
h1 {
  font-family: var(--font-display);
  font-size: var(--font-size-h1-large);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-relaxed);
  letter-spacing: var(--letter-spacing-tight);
}
```

### Using Spacing Variables
```css
.card {
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
}
```

### Using Transition Variables
```css
a {
  transition: color var(--transition-normal);
}
```

## Dark Mode

All color variables automatically adjust based on `prefers-color-scheme: dark`. The system handles the theme switching automatically without requiring additional CSS.

## Backward Compatibility

The following legacy variable names are still supported:
- `--background-color` → `--color-primary-white`
- `--text-color` → `--color-primary-dark`
- `--text-color-secondary` → `--color-gray`
- `--accent-color` → `--color-accent-blue`
- `--accent-color-hover` → `--color-accent-blue-light`
- `--border-color` → `--color-secondary-light`
- `--background-alt` → `--color-semantic-primary`
- `--font-family-display` → `--font-display`
- `--font-family-text` → `--font-text`
