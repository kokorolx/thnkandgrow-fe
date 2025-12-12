# Apple Design System Implementation Checklist

## Phase 1: Setup (15 min)

- [ ] Read `APPLE_MIGRATION_SUMMARY.md`
- [ ] Read `DESIGN_MIGRATION_GUIDE.md`
- [ ] Review `src/styles/apple-design-system-v2.css`
- [ ] Run audit: `node scripts/migrate-to-apple-design.js`

## Phase 2: Core Files (30 min)

### Update Import

- [ ] **src/app/globals.css**
  - Change: `@import url("../styles/apple-design-system-v2.css");`
  - Verify CSS variables are available
  - Check for conflicting declarations

### Verify Base Styles

- [ ] Typography variables loaded
- [ ] Colors properly inverted for dark mode
- [ ] Responsive breakpoints available
- [ ] Focus states working

## Phase 3: Page Updates (90 min)

### 1. Homepage (Priority: HIGH)
**File:** `src/app/page.module.css`  
**Issues:** 45

- [ ] Replace hardcoded `padding` with `var(--spacing-*)`
  - `80px` → `var(--spacing-5xl)`
  - `20px` → `var(--spacing-xl)`
  - `16px` → `var(--spacing-lg)`
  - etc.

- [ ] Replace hardcoded `margin` with `var(--spacing-*)`

- [ ] Replace hardcoded `font-size`
  - Find all numeric sizes
  - Map to: `var(--font-size-h1-*)`, `var(--font-size-body)`, etc.

- [ ] Replace hardcoded colors
  - `#f5f5f7` → `var(--color-semantic-primary)`
  - `#1d1d1f` → `var(--color-primary-dark)`
  - `#ffffff` → `var(--color-primary-white)`
  - `rgba(255, 255, 255, 0.9)` → Document and decide

- [ ] Fix border-radius
  - `24px` → `var(--border-radius-pill)`
  - Check if it's a button (should use pill)

- [ ] Replace box-shadow
  - Custom shadows → `var(--shadow-md)` or `var(--shadow-lg)`

- [ ] Test responsive behavior

### 2. About Page (Priority: HIGH)
**File:** `src/app/about/page.module.css`  
**Issues:** 53

- [ ] Replace padding/margin (80px, 60px, 20px)
- [ ] Fix line-height (1.08349 → `var(--line-height-tight)`)
- [ ] Fix colors (#86868b, #0077ed)
- [ ] Fix border-radius
- [ ] Replace box-shadow
- [ ] Test on mobile (480px breakpoint)

### 3. Portfolio Pages (Priority: HIGH)
**File:** `src/app/portfolio/page.module.css`  
**Issues:** 28

- [ ] src/app/portfolio/page.module.css
  - [ ] Replace spacing values
  - [ ] Fix colors
  - [ ] Update font-size

- [ ] src/app/portfolio/[slug]/page.module.css
  - [ ] Fix border-radius (980px → `var(--border-radius-full)`)
  - [ ] Replace spacing
  - [ ] Update colors

- [ ] Test portfolio card layouts

### 4. Search/Archive (Priority: MEDIUM)
**File:** `src/app/search/page.module.css`, `src/app/archive.module.css`  
**Issues:** Combined 20+

- [ ] Replace all hardcoded values
- [ ] Update responsive behavior

## Phase 4: Component Updates (90 min)

### Priority Components

#### 1. Header (Priority: HIGH)
**File:** `src/components/Header.module.css`  
**Issues:** 21

- [ ] Replace font-family: "Inter" → `var(--font-display)` or `var(--font-text)`
- [ ] Replace spacing
- [ ] Replace colors
- [ ] Verify navigation styling
- [ ] Test mobile menu

#### 2. Cards (Priority: HIGH)
**Files:** `src/components/PortfolioCard.module.css`, `src/components/PostCard.module.css`  
**Issues:** 28 combined

PortfolioCard:
- [ ] Padding: `16px` → `var(--spacing-lg)`
- [ ] Margin: `20px` → `var(--spacing-xl)`
- [ ] Border-radius
- [ ] Box-shadow: Custom → `var(--shadow-md)`
- [ ] Hover effects

PostCard:
- [ ] Same as PortfolioCard
- [ ] Check date/metadata styling

#### 3. Footer (Priority: MEDIUM)
**File:** `src/components/Footer.module.css`  
**Issues:** 15

- [ ] Replace padding/margin
- [ ] Update font sizes (to SF Pro scales)
- [ ] Fix colors
- [ ] Border separators

#### 4. Search (Priority: MEDIUM)
**File:** `src/components/Search.module.css`  
**Issues:** 10

- [ ] Fix border-radius (0 → may need reconsideration)
- [ ] Replace spacing
- [ ] Input focus styles
- [ ] Button styling

#### 5. LoadMoreButton (Priority: LOW)
**File:** `src/components/LoadMoreButton.module.css`  
**Issues:** 5

- [ ] Fix border-radius (980px → `var(--border-radius-pill)`)
- [ ] Replace padding with spacing variables
- [ ] Verify hover/active states

#### 6. TextToSpeechReader (Priority: LOW)
**File:** `src/components/TextToSpeechReader.module.css`  
**Issues:** 10

- [ ] Replace spacing
- [ ] Replace colors
- [ ] Fix shadows
- [ ] Button styling

## Phase 5: Testing (45 min)

### Visual Testing

- [ ] Homepage layout looks correct
- [ ] Colors match Apple palette
- [ ] Typography renders properly (SF Pro)
- [ ] Spacing is consistent
- [ ] Shadows are subtle

### Responsive Testing

Test at breakpoints:

- [ ] **480px** (Mobile portrait)
  - [ ] Text readable
  - [ ] Buttons full width
  - [ ] Spacing adjusted

- [ ] **767px** (Mobile landscape)
  - [ ] Navigation works
  - [ ] Cards stack properly

- [ ] **833px** (Tablet)
  - [ ] Grid 2-column layout
  - [ ] Proper padding

- [ ] **1068px** (Desktop)
  - [ ] Full layout restored
  - [ ] Heading sizes correct

- [ ] **1440px** (Large desktop)
  - [ ] Container width proper
  - [ ] Spacing generous

### Dark Mode Testing

- [ ] Toggle dark mode in DevTools
- [ ] Colors invert correctly
- [ ] Text contrast OK
- [ ] Links visible
- [ ] Buttons clickable

### Accessibility Testing

- [ ] Tab navigation works
- [ ] Focus indicators visible (2px blue outline)
- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Form labels associated

### Browser Testing

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Chrome (Android)

## Phase 6: Validation (15 min)

### Run Audit

```bash
node scripts/migrate-to-apple-design.js
```

Expected output:
```
📈 Summary: 0 total issues found
```

### CSS Validation

```bash
# Find remaining hardcoded values
grep -r "padding.*px" src/components --include="*.module.css" | grep -v "var("
grep -r "margin.*px" src/components --include="*.module.css" | grep -v "var("
grep -r "#[0-9a-f]" src/components --include="*.module.css" | grep -v "rgba"

# Should return: no results
```

### Visual Regression

- [ ] Compare with Apple.com newsroom
- [ ] Check specific components:
  - [ ] Buttons match styling
  - [ ] Cards have proper shadows
  - [ ] Typography hierarchy clear
  - [ ] Spacing feels balanced

## Phase 7: Build & Deploy (15 min)

### Build

```bash
npm run build
```

- [ ] No CSS errors
- [ ] No TypeScript errors
- [ ] Build completes successfully

### Local Testing

```bash
npm run start
```

- [ ] Site loads at localhost:3000
- [ ] All pages accessible
- [ ] No console errors
- [ ] Performance acceptable

### Pre-Deployment Checklist

- [ ] All CSS variables used instead of hardcoded values
- [ ] Dark mode working
- [ ] Responsive design verified
- [ ] Accessibility tested
- [ ] No visual regressions
- [ ] Audit returns 0 issues

## Summary

### Files Modified

| File | Status | Issues | Priority |
|------|--------|--------|----------|
| src/app/globals.css | [ ] | 1 | HIGH |
| src/app/page.module.css | [ ] | 45 | HIGH |
| src/app/about/page.module.css | [ ] | 53 | HIGH |
| src/app/portfolio/page.module.css | [ ] | 28 | HIGH |
| src/app/portfolio/[slug]/page.module.css | [ ] | 15 | MEDIUM |
| src/components/Header.module.css | [ ] | 21 | HIGH |
| src/components/PortfolioCard.module.css | [ ] | 19 | HIGH |
| src/components/PostCard.module.css | [ ] | 9 | MEDIUM |
| src/components/Footer.module.css | [ ] | 15 | MEDIUM |
| src/components/Search.module.css | [ ] | 10 | MEDIUM |
| src/components/LoadMoreButton.module.css | [ ] | 5 | LOW |
| src/components/TextToSpeechReader.module.css | [ ] | 10 | LOW |
| **Total** | | **244** | |

### Time Estimates

| Phase | Estimate | Actual |
|-------|----------|--------|
| Setup | 15 min | [ ] |
| Core Files | 30 min | [ ] |
| Page Updates | 90 min | [ ] |
| Component Updates | 90 min | [ ] |
| Testing | 45 min | [ ] |
| Validation | 15 min | [ ] |
| Build & Deploy | 15 min | [ ] |
| **Total** | **4h 40 min** | [ ] |

### Quick Commands Reference

```bash
# Audit design system
node scripts/migrate-to-apple-design.js

# Build project
npm run build

# Start dev server
npm run start

# Find hardcoded spacing
grep -r "[0-9]\+px" src --include="*.css" | grep -v "var("

# Find hardcoded colors
grep -r "#[0-9a-f]\{6\}" src --include="*.css" | grep -v "rgba"

# Validate CSS
npx stylelint "src/**/*.css" --fix
```

## Notes

Use this section to track progress and notes:

```
[ ] Started: ___________
[ ] Completed: _________

Notable changes:
- 
- 

Issues encountered:
- 
- 

Decisions made:
- 
- 
```

---

**Last Updated:** 2025-12-11  
**Total Issues to Fix:** 244  
**Estimated Time:** 4-5 hours  
**Status:** Ready to implement
