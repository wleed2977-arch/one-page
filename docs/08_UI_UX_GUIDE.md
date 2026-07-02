# 08 — UI/UX Guide

**Audience:** Beginners learning interface design principles.  
**Prerequisites:** [03 — Frontend Guide](03_FRONTEND_GUIDE.md)  
**What you will learn:** How OnePage's visual design works, why choices were made, and accessibility basics.

**Read next:** [09 — Complete Project Flow](09_COMPLETE_PROJECT_FLOW.md)

---

## Design Philosophy

OnePage's brand ([`BRAND_SYSTEM.md`](../BRAND_SYSTEM.md)) aims to feel:

- **Friendly, minimal, calm** — not corporate or flashy
- **Professional** — suitable for portfolios and job seekers
- **Accessible** — readable typography and clear hierarchy

Tagline: **"Build your online identity."**

---

## Design Tokens

Central definitions in [`client/styles/base/variables.css`](../client/styles/base/variables.css):

| Token category | Examples |
|----------------|----------|
| Colors | `--color-primary`, `--color-bg`, `--color-text` |
| Spacing | `--space-xs` through `--space-2xl` |
| Radius | `--radius-sm`, `--radius-lg` |
| Shadows | `--shadow-sm`, `--shadow-md` |
| Typography | Font stacks, size scale |

Using tokens means changing `--color-primary` updates buttons, links, and accents everywhere.

---

## Spacing

### Definition
**Spacing** is whitespace between elements. Consistent spacing creates rhythm and readability.

### OnePage approach
- Multiples of a base unit (typically 4px/8px scale)
- Cards and sections use `--space-lg` padding
- Dashboard grid gaps use layout utilities in [`styles/layout/grid.css`](../client/styles/layout/grid.css)

### Why it matters
Cramped layouts feel amateur. Generous whitespace signals quality.

---

## Typography

### Hierarchy
| Level | Use |
|-------|-----|
| H1 | Page titles, hero headlines |
| H2 | Section headings |
| Body | Paragraphs, descriptions |
| Small/caption | Meta text, labels |

[`styles/base/typography.css`](../client/styles/base/typography.css) defines font sizes and line heights.

### Readability
- Sufficient contrast between text and background
- Line length limited by container max-width
- Theme files adjust colors per theme while keeping scale

---

## Grid and Layout

### Dashboard
Sidebar + main content via [`utils/layout.js`](../client/scripts/utils/layout.js):
- `dashboardNav()` — consistent navigation
- `bindDashboardLayout()` — SPA link handling, logout

### Builder
Three-column grid on desktop; tabbed panels on mobile.

### Public page
Single-column stacked widgets — natural scroll for portfolios.

---

## Cards

**Cards** group related content with border, shadow, and padding.

Used for:
- Dashboard stat cards (views, widgets, theme)
- Auth forms (login, register)
- Theme picker in appearance page

Styles: [`styles/components/card.css`](../client/styles/components/card.css)

---

## Buttons

Variants in [`styles/components/button.css`](../client/styles/components/button.css):

| Class | Use |
|-------|-----|
| Primary | Main actions (Save, Register) |
| Secondary | Less prominent actions |
| Ghost | Tertiary, icon buttons |

States: hover, focus, disabled, loading.

---

## Modals

Used for confirmations (delete widget, save empty page).

[`styles/components/modal.css`](../client/styles/components/modal.css) — overlay, centered panel, focus trap pattern.

---

## Toasts

**Toasts** are temporary notification banners.

[`utils/toast.js`](../client/scripts/utils/toast.js) — success/error messages after save, copy link, etc.

Non-blocking — user can continue working.

---

## Accessibility

### Semantic HTML
Widgets use appropriate elements: `<section>`, `<h2>`, `<form>`, `<label>`, `<button>`.

### Focus states
Buttons and links have visible focus outlines for keyboard navigation.

### Color contrast
Light and dark themes tested for readable text/background pairs.

### Reduced motion
[`styles/base/motion.css`](../client/styles/base/motion.css) should respect `prefers-reduced-motion` where animations are used.

### Areas to improve
- Full ARIA labels on builder controls
- Skip navigation link
- Screen reader announcements for toast messages

---

## Responsive Design

### Breakpoints
CSS media queries adjust:
- Sidebar → hamburger or stacked layout
- Builder → tab interface
- Font sizes and padding on small screens

### Mobile-first consideration
Touch targets at least ~44px for buttons.

---

## Theme System UX

### Six themes

| Theme | Personality |
|-------|-------------|
| light | Clean, default |
| dark | Low light, developer-friendly |
| linear | Sharp, minimal lines |
| glass | Frosted, translucent panels |
| forest | Earthy greens |
| ocean | Cool blues |

### App vs public theming
- **App chrome** (dashboard, builder UI) stays **light brand** — consistent tool experience
- **Public pages** use owner's chosen theme — personal expression

This prevents a dark public theme from making the builder controls hard to read.

---

## Widget Visual Design

Each widget has styles in [`styles/components/widgets.css`](../client/styles/components/widgets.css) and inherits theme variables.

- Hero: large headline, CTA button
- Skills: animated progress bars on public page
- Gallery: grid with lightbox overlay
- Contact: form fields matching theme inputs

---

## Onboarding UX

Four-step wizard with progress indicator:
1. Reduces cognitive load — one decision at a time
2. Ends with preview — immediate reward
3. Seeds content — user never sees empty page

---

## Empty States

When no widgets or no analytics data, friendly messages guide next action ("Add your first widget").

[`styles/components/empty-state.css`](../client/styles/components/empty-state.css)

---

## Why This Design

| Choice | Reason |
|--------|--------|
| Minimal chrome | Content (user's portfolio) is the star |
| Light dashboard | Tool UI should not compete with preview |
| Card-based dashboard | Scannable stats and actions |
| Schema-driven properties | Consistent editing UX for all widgets |
| Lucide icons | Lightweight, consistent icon set via CDN |

---

## Key Takeaways

- Design tokens enable consistent spacing, color, and type
- App UI and public pages use different theme strategies
- Components (cards, buttons, modals, toasts) compose the interface
- Responsive and accessible patterns support all users

---

## Mini Exercise

Pick two themes in the appearance page. List three CSS variables that change between them.
