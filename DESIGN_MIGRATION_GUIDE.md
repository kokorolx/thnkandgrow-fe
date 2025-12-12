# Apple Design System Migration Guide

## Overview

This guide documents the migration from the localhost design system to Apple's actual design system extracted from `apple.com/newsroom`. The migration ensures your site accurately reflects Apple's design language.

---

## What Changed

### 1. **Typography System** ✅

| Aspect | Localhost | Apple | Fix |
|--------|-----------|-------|-----|
| **Fonts** | Mixed SF Pro + Inter | SF Pro Display/Text only | ✓ Updated to use SF Pro exclusively |
| **Font Count** | 15 styles | 36+ extracted styles | ✓ Added comprehensive size scale |
| **Heading Sizes** | Limited | 48px, 34px, 32px, 25.5px, 24px, 21px | ✓ Full Apple scale |
| **Line Heights** | Single values | Context-specific (1.08-1.47) | ✓ Precise per-size line heights |
| **Letter Spacing** | Fixed | Variable per context | ✓ Applied Apple's spacing rules |

**Key Changes:**
- Removed: Inter font family
- Added: SF Pro Display (headings), SF Pro Text (body)
- Added: 48px (3rem) heading size
- Proper letter-spacing per Apple's specs

### 2. **Color System** ✅

| Color | Localhost | Apple | Count | Confidence |
|-------|-----------|-------|-------|------------|
| Primary Dark | #1d1d1f | #1d1d1f | 782 | high |
| Primary Black | #000000 | #000000 | 545 | high |
| Primary White | #ffffff | #ffffff | 210 | high |
| Accent Blue | #0066cc | #0066cc | 52 | high |
| Semantic Light | #e8e8ed | #e8e8ed (secondary) | - | - |

**Key Changes:**
- Removed: #e8e8ed as primary color
- Clarified: Color roles (primary vs semantic)
- Added: Proper CSS variable naming
- Updated: Dark mode color inversion

### 3. **Spacing System** ✅

| Issue | Before | After |
|-------|--------|-------|
| Fractional values | 0.015625px, 22.7969px | Clean scale only |
| Scale base | Mixed | Pure 8px (4, 8, 12, 16, 20, 24, 32, 40, 48, 64px) |
| Consistency | 58% use var() | 100% encouraged |
| Clean values | 145/285 | 285/285 ✓ |

**Key Changes:**
- Removed: 0.015625px, 0.5625px, 22.7969px, 22.8125px, 34px
- Standardized: All spacing to 8px multiples
- Added: 2px, 80px, 96px for completeness

### 4. **Border Radius** ✅

| Before | After |
|--------|-------|
| 12px, 24px (custom) | Component-driven (2px, 4px, 8px, 12px, 16px, 50%) |
| No CSS variables | Full variable system |
| - | Added: pill (24px) for buttons |

**Key Changes:**
- Updated: Border radius strategy
- Added: Proper radius scale
- Context: Apple uses subtle rounded corners

### 5. **Shadow System** ✅

| Localhost | Apple | Status |
|-----------|-------|--------|
| Custom: rgba(0,0,0,0.15) 0px 4px 12px | Standard system | ✓ Moved to --shadow-md |
| None extracted | 3 standard shadows | ✓ Comprehensive shadow scale |

**Key Changes:**
- Removed: Custom shadows outside Apple's system
- Added: Standard shadow scale (sm, md, lg)
- Added: Focus shadow (0 0 0 2px #0071e3)

### 6. **Components** ✅

| Component | Localhost | Apple | Status |
|-----------|-----------|-------|--------|
| Buttons | Basic | 5+ state variations | ✓ Enhanced |
| Button States | Minimal | Default, hover, active, focus | ✓ Full |
| Button Transforms | Simple scale | Scale + opacity + color shifts | ✓ Added |
| Link Styles | Basic | Multiple weight/color combos | ✓ Comprehensive |
| Form Elements | Standard | Apple's refined | ✓ Updated |

---

## Migration Steps

### Phase 1: Update CSS Files

#### Step 1: Update `globals.css`

Replace the import:

```css
/* OLD */
@import url("../styles/apple-design-system.css");

/* NEW */
@import url("../styles/apple-design-system-v2.css");
```

#### Step 2: Verify Variables Are Loaded

Check that all CSS variables from `apple-design-system-v2.css` are available:

```bash
grep "^  --" src/styles/apple-design-system-v2.css | wc -l
# Should output: 60+ variables
```

#### Step 3: Run Migration Audit

```bash
node scripts/migrate-to-apple-design.js
```

This will report:
- Hardcoded spacing violations
- Non-Apple font usage
- Color system inconsistencies
- Border radius mismatches
- Shadow system issues

### Phase 2: Update Component CSS

For each `.module.css` file:

1. **Replace hardcoded spacing:**

```css
/* OLD */
padding: 12px 16px;
margin: 20px 0;

/* NEW */
padding: var(--spacing-md) var(--spacing-lg);
margin: var(--spacing-xl) 0;
```

2. **Replace hardcoded colors:**

```css
/* OLD */
background-color: #f5f5f7;
color: #1d1d1f;

/* NEW */
background-color: var(--color-semantic-primary);
color: var(--color-primary-dark);
```

3. **Standardize border radius:**

```css
/* OLD */
border-radius: 12px;
border-radius: 24px;

/* NEW */
border-radius: var(--border-radius-lg);  /* 12px */
border-radius: var(--border-radius-pill); /* 24px - for buttons */
```

4. **Remove custom fonts:**

```css
/* OLD */
font-family: "Inter", -apple-system, ...;

/* NEW */
font-family: var(--font-text);
```

### Phase 3: Verify Responsive Design

Apple's extracted breakpoints:

```css
480px    → Mobile portrait
567px    → Mobile landscape
641px    → Tablet
768px    → Tablet standard
833px    → Tablet large
1024px   → Desktop small
1068px   → Desktop standard
1440px   → Desktop large
1632px   → Desktop extra large
1920px+  → Ultra-wide
```

Update media queries in components:

```css
/* OLD */
@media (max-width: 767px) { ... }

/* NEW */
@media (max-width: var(--bp-tablet-lg)) { ... }
/* Or use explicit breakpoints from Apple */
```

### Phase 4: Test Dark Mode

Verify all CSS variables work in dark mode:

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Colors automatically invert */
  }
}
```

Test with: `prefers-color-scheme: dark` in DevTools

---

## Quick Reference: Variable Mapping

### Colors

```css
--color-primary-dark       → Main text, UI (#1d1d1f)
--color-primary-black      → High contrast (#000000)
--color-primary-white      → Light text, content (#ffffff)
--color-primary-light      → Light backgrounds (#f5f5f7)
--color-secondary-light    → Borders, dividers (#e8e8ed)
--color-gray               → Secondary text, icons (#6e6e73)
--color-accent-blue        → Interactive elements (#0066cc)
--color-accent-blue-light  → Hover, focus (#0071e3)
--color-semantic-*         → Context-specific colors
```

### Spacing (8px scale)

```css
--spacing-xs    → 4px
--spacing-sm    → 8px
--spacing-md    → 12px
--spacing-lg    → 16px
--spacing-xl    → 20px
--spacing-2xl   → 24px
--spacing-3xl   → 32px
--spacing-4xl   → 40px
--spacing-5xl   → 48px
--spacing-6xl   → 64px
```

### Typography

```css
--font-display       → SF Pro Display (headings)
--font-text          → SF Pro Text (body)
--font-size-h1-*     → Heading sizes
--font-weight-*      → 300, 400, 500, 600, 700
--line-height-*      → 1.13, 1.42, 1.47, 1.5, 1.6
--letter-spacing-*   → -0.374px, 0, 0.231px
```

### Components

```css
--border-radius-lg      → 12px (default)
--border-radius-pill    → 24px (buttons)
--border-radius-full    → 50% (circles)
--shadow-md             → Hover cards
--shadow-focus          → Focus indicator
--transition-normal     → 200ms ease-out
--focus-outline         → 2px solid #0071e3
```

---

## File-by-File Changes

### Priority 1: Core Files

- ✅ `src/styles/apple-design-system-v2.css` - New comprehensive system
- ✅ `src/app/globals.css` - Import v2
- ⚠️ `src/app/page.module.css` - Update spacing/colors
- ⚠️ `src/components/Header.module.css` - SF Pro font usage

### Priority 2: Components

- ⚠️ `src/components/PortfolioCard.module.css`
- ⚠️ `src/components/PostCard.module.css`
- ⚠️ `src/components/Footer.module.css`
- ⚠️ `src/components/Search.module.css`
- ⚠️ `src/components/LoadMoreButton.module.css`

### Priority 3: Pages

- ⚠️ `src/app/portfolio/page.module.css`
- ⚠️ `src/app/search/page.module.css`
- ⚠️ `src/app/archive.module.css`

---

## Common Patterns to Replace

### Button Styling

```css
/* OLD */
.button {
  padding: 8px 16px;
  background: #0066cc;
  border-radius: 12px;
  font-size: 18px;
}

/* NEW */
.button {
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--color-accent-blue);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-button-normal);
  font-family: var(--font-text);
  font-weight: var(--font-weight-regular);
}

.button:hover {
  background-color: var(--color-accent-blue-light);
  transform: scale(1.02);
}

.button:focus {
  outline: var(--focus-outline);
  box-shadow: var(--shadow-button-focus);
}
```

### Card Styling

```css
/* OLD */
.card {
  padding: 16px;
  background: #f5f5f7;
  border: 1px solid #e8e8ed;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* NEW */
.card {
  padding: var(--spacing-lg);
  background-color: var(--color-semantic-primary);
  border: 1px solid var(--color-secondary-light);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  transition: box-shadow var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}
```

### Heading Styling

```css
/* OLD */
h1 {
  font-family: "SF Pro Display", serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
}

/* NEW */
h1 {
  font-family: var(--font-display);
  font-size: var(--font-size-h1-display);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-normal);
}
```

---

## Validation Checklist

- [ ] All `padding`, `margin`, `gap` use spacing variables
- [ ] All `color`, `background-color`, `border-color` use color variables
- [ ] All `font-family` use `var(--font-display)` or `var(--font-text)`
- [ ] All `border-radius` use border-radius variables
- [ ] No hardcoded breakpoints (use CSS variables or standard values)
- [ ] `box-shadow` uses `var(--shadow-*)` or `none`
- [ ] Focus states use `var(--focus-outline)`
- [ ] Transitions use `var(--transition-*)`
- [ ] Dark mode works with `:root` variable inversions
- [ ] Mobile responsive at: 480px, 767px, 833px, 1068px, 1440px breakpoints

---

## Testing Commands

```bash
# Audit current design system usage
node scripts/migrate-to-apple-design.js

# Validate CSS variables are defined
grep "var(--" src/**/*.module.css | wc -l

# Find remaining hardcoded values
grep -r "#[0-9a-f]\{6\}" src/components --include="*.css" | grep -v "url"
grep -r "[0-9]\+px" src/components --include="*.css" | grep -v "var("

# Check media queries
grep -r "@media" src/components --include="*.css"

# Build and test
npm run build
npm run start
```

---

## Before & After Comparison

### Before (Localhost)

```json
{
  "colors": 10,
  "colors_consistency": "70%",
  "typography": 15,
  "typography_consistency": "60%",
  "spacing": 58,
  "spacing_consistency": "50%",
  "components": "minimal",
  "frameworks": "none"
}
```

### After (Apple Design System)

```json
{
  "colors": 13,
  "colors_consistency": "100%",
  "typography": 36,
  "typography_consistency": "100%",
  "spacing": "8px clean scale",
  "spacing_consistency": "100%",
  "components": "comprehensive",
  "frameworks": "Apple design language"
}
```

---

## Support

For detailed variable reference, see:
- `src/styles/APPLE_DESIGN_TOKENS.md` - All available tokens
- `src/styles/apple-design-system-v2.css` - Full CSS implementation

Run audit: `node scripts/migrate-to-apple-design.js`
