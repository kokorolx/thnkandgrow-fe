# Apple Newsroom Clone - Implementation Prompt

**Goal:** Transform the current blog into a pixel-perfect clone of the [Apple Newsroom](https://www.apple.com/newsroom/), adapting it for a personal blog context. The design must be minimalist, premium, and highly responsive.

## 1. Design System & Aesthetics
*   **Visual Style:** Clean, white-space dominant, "flat" but premium feel.
*   **Typography:**
    *   **Font Stack:** System fonts mirroring San Francisco (`-apple-system`, `BlinkMacSystemFont`, `Inter`, `sans-serif`).
    *   **Headings:** Bold, tight letter-spacing (tracking).
    *   **Body:** High legibility, comfortable line-height (~1.5), font size ~17px-19px for reading.
    *   **Colors:**
        *   **Background:** `#ffffff` (Light), `#1d1d1f` (Dark).
        *   **Text:** `#1d1d1f` (Primary), `#86868b` (Secondary/Meta).
        *   **Accents:** `#0066cc` (Links/Action).
*   **Layout:**
    *   **Container:** Max-width ~980px or 1200px, centered.
    *   **Grid:** 12-column grid for flexible layouts.

## 2. Core Components

### Header (Navigation)
*   **Behavior:** Sticky top with `backdrop-filter: blur(20px)` and slightly translucent background (`rgba(255,255,255,0.8)`).
*   **Elements:**
    *   **Logo:** Minimalist text or icon on the left.
    *   **Links:** "Newsroom", "Open Source", "About", "Contact" (centered or right-aligned).
    *   **Search:** A subtle magnifying glass icon on the right.
*   **Mobile:** Hamburger menu that expands into a full-screen or slide-down menu with smooth animation.

### Footer
*   **Layout:** Clean, organized links.
*   **Content:** Copyright info, "Privacy Policy", "Terms of Use", and social links.
*   **Style:** Small font size (~12px), gray text, top border separator.

### Post Card (Grid Item)
*   **Image:** High-quality thumbnail, sharp corners (or very subtle 4px radius), hover zoom effect (subtle).
*   **Meta:** Category name in uppercase, small, bold, gray.
*   **Title:** Bold, readable, black text.
*   **Date:** Relative (e.g., "2 days ago") or formatted (e.g., "November 20, 2025"), gray text.

## 3. Page Specifications

### A. Home Page (`/`)
*   **Hero Section:**
    *   **Layout:** Full-width or large container.
    *   **Content:** Most recent "Featured" post. Large image, overlay text or text adjacent.
*   **Latest News:**
    *   **Layout:** 2-column or 3-column grid of Post Cards.
    *   **Section Title:** "Latest News" or "Updates" in large, bold type.

### B. Post Detail Page (`/posts/[slug]`)
*   **Header:**
    *   **Category:** Small, uppercase, centered (e.g., "PRESS RELEASE").
    *   **Title:** Massive H1, centered, tight tracking.
    *   **Date/Author:** Centered below title, gray text.
    *   **Social Share:** Sticky sidebar or fixed bottom bar on mobile.
*   **Hero Image:** Large, high-res image below the header (or above title depending on specific Apple era style).
*   **Content Body:**
    *   **Width:** Narrower reading column (approx 700px) for focus.
    *   **Text:** Large body font (~19px-21px).
    *   **Images:** Full-bleed or wide images breaking the text column.
    *   **Quotes:** Large, pull-quotes styled elegantly.
*   **Footer:** "More from [Category]" section with 3 related post cards.

### C. Archive Pages (`/category/*`, `/tag/*`, `/author/*`)
*   **Header:**
    *   **Title:** Large H1 identifying the archive (e.g., "Category: Engineering", "Author: Tam Nguyen").
    *   **Description:** Brief description or bio (for authors).
*   **List:** Grid layout of posts belonging to that archive.
*   **Pagination:** "Load More" button or numeric pagination, styled minimally.

### D. Search Page (`/search`)
*   **Input:** Large, minimal input field with no border (bottom border only on focus).
*   **Results:**
    *   **Live Search:** (Optional) Results appear as you type.
    *   **Layout:** List view with small thumbnails or grid view.
    *   **Empty State:** "No results found" with suggested categories.

## 4. Technical Instructions
*   **Framework:** Next.js (App Router).
*   **Styling:** CSS Modules or Tailwind CSS (match project preference).
*   **Responsiveness:** Mobile-first. Ensure touch targets are large enough.
*   **Images:** Use `next/image` for optimization.
*   **Animations:** Subtle fade-ins on scroll (`framer-motion` or CSS transitions).

## 5. Implementation Steps
1.  **Setup Design Tokens:** Define colors, fonts, and spacing variables.
2.  **Build Layout Wrapper:** Implement the sticky Header and Footer.
3.  **Create PostCard Component:** The building block for lists.
4.  **Build Page Templates:**
    *   `page.tsx` (Home)
    *   `posts/[slug]/page.tsx` (Detail)
    *   `search/page.tsx`
    *   `category/[slug]/page.tsx`
5.  **Refine Details:** Add hover states, transitions, and ensure accessibility.
