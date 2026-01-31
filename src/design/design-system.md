# Design System - E-Commerce Platform

**Version:** 1.0.0
**Last Updated:** 2025-11-13
**Status:** Base Template - Ready for Customization

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Elevation & Shadows](#elevation--shadows)
6. [Border Radius](#border-radius)
7. [Breakpoints](#breakpoints)
8. [Animation & Transitions](#animation--transitions)
9. [Accessibility Guidelines](#accessibility-guidelines)
10. [Theming & Customization](#theming--customization)

---

## Design Principles

### 1. User-Centered Design
- **Clarity over Cleverness:** Every UI element should have a clear purpose
- **Progressive Disclosure:** Show what users need, when they need it
- **Feedback & Response:** Immediate visual feedback for all interactions

### 2. Consistency
- **Predictable Patterns:** Similar actions should look and behave similarly
- **Unified Voice:** Consistent tone in copy, icons, and interactions
- **Component Reusability:** Build once, use everywhere

### 3. Accessibility First
- **WCAG 2.1 AA Compliance:** Minimum contrast ratios, keyboard navigation
- **Screen Reader Support:** Semantic HTML, ARIA labels when needed
- **Touch Targets:** Minimum 44x44px for interactive elements

### 4. Performance
- **Mobile-First:** Optimize for smaller devices first
- **Progressive Enhancement:** Core functionality works everywhere
- **Lazy Loading:** Images and heavy components load on demand

### 5. Flexibility
- **Theme Agnostic:** Easy color/brand customization
- **Responsive by Default:** All components adapt to screen size
- **Scalable Architecture:** Support growth from MVP to enterprise

---

## Color System

### Base Palette (Neutral/Generic)

The color system uses CSS variables for easy theming. Default values are neutral and professional.

#### Primary Colors
```css
--color-primary-50: #f0f9ff;
--color-primary-100: #e0f2fe;
--color-primary-200: #bae6fd;
--color-primary-300: #7dd3fc;
--color-primary-400: #38bdf8;
--color-primary-500: #0ea5e9;  /* Main primary */
--color-primary-600: #0284c7;
--color-primary-700: #0369a1;
--color-primary-800: #075985;
--color-primary-900: #0c4a6e;
--color-primary-950: #082f49;
```

**Usage:**
- Main CTAs (Add to Cart, Checkout, Primary Buttons)
- Active navigation states
- Links and interactive elements
- Progress indicators

#### Secondary Colors
```css
--color-secondary-50: #faf5ff;
--color-secondary-100: #f3e8ff;
--color-secondary-200: #e9d5ff;
--color-secondary-300: #d8b4fe;
--color-secondary-400: #c084fc;
--color-secondary-500: #a855f7;  /* Main secondary */
--color-secondary-600: #9333ea;
--color-secondary-700: #7e22ce;
--color-secondary-800: #6b21a8;
--color-secondary-900: #581c87;
--color-secondary-950: #3b0764;
```

**Usage:**
- Secondary CTAs
- Badges for "Featured", "New Arrival"
- Accent elements
- Alternative interactive states

#### Neutral/Gray Scale
```css
--color-neutral-50: #fafafa;
--color-neutral-100: #f5f5f5;
--color-neutral-200: #e5e5e5;
--color-neutral-300: #d4d4d4;
--color-neutral-400: #a3a3a3;
--color-neutral-500: #737373;
--color-neutral-600: #525252;
--color-neutral-700: #404040;
--color-neutral-800: #262626;
--color-neutral-900: #171717;
--color-neutral-950: #0a0a0a;
```

**Usage:**
- Text (900 for headings, 700 for body, 500 for secondary)
- Borders (200, 300)
- Backgrounds (50, 100)
- Disabled states (300, 400)

#### Semantic Colors

**Success (Green)**
```css
--color-success-50: #f0fdf4;
--color-success-500: #22c55e;  /* Main */
--color-success-700: #15803d;
```
**Usage:** Order confirmed, stock available, success messages

**Error (Red)**
```css
--color-error-50: #fef2f2;
--color-error-500: #ef4444;  /* Main */
--color-error-700: #b91c1c;
```
**Usage:** Out of stock, form errors, destructive actions

**Warning (Yellow/Orange)**
```css
--color-warning-50: #fffbeb;
--color-warning-500: #f59e0b;  /* Main */
--color-warning-700: #c2410c;
```
**Usage:** Low stock alerts, payment pending, caution messages

**Info (Blue)**
```css
--color-info-50: #eff6ff;
--color-info-500: #3b82f6;  /* Main */
--color-info-700: #1d4ed8;
```
**Usage:** Informational messages, tooltips, helpful hints

#### Special Colors

**Sale/Discount (Red-Orange)**
```css
--color-sale: #dc2626;
--color-sale-bg: #fee2e2;
```
**Usage:** Sale badges, discount tags, promotional elements

**Rating (Gold)**
```css
--color-rating: #fbbf24;
--color-rating-empty: #d1d5db;
```
**Usage:** Star ratings, featured product highlights

### Color Usage Guidelines

1. **Text Contrast Ratios:**
   - Large text (18px+): Minimum 3:1
   - Normal text: Minimum 4.5:1
   - Interactive elements: Minimum 3:1

2. **Background Combinations:**
   - Light backgrounds: Use 700-900 for text
   - Dark backgrounds: Use 50-300 for text
   - Colored backgrounds: Ensure sufficient contrast

3. **State Variations:**
   - Hover: Darken by 100 (e.g., 500 → 600)
   - Active/Pressed: Darken by 200 (e.g., 500 → 700)
   - Disabled: Use neutral-300 or neutral-400

---

## Typography

### Font Families

```css
--font-sans: 'Inter', 'system-ui', -apple-system, BlinkMacSystemFont,
             'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
--font-serif: 'Georgia', 'Cambria', 'Times New Roman', serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace;
```

**Default:** `--font-sans` for all UI elements

**Usage:**
- **Sans-serif:** Body text, UI components, navigation (primary)
- **Serif:** Optional for headings or editorial content
- **Mono:** Order numbers, SKU codes, technical specs

### Font Sizes

Based on a modular scale (1.250 - Major Third)

```css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */
--text-6xl: 3.75rem;    /* 60px */
```

### Font Weights

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Line Heights

```css
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

### Typography Scale Usage

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| **H1** | 3xl-4xl | Bold (700) | Tight (1.25) | Page titles, hero sections |
| **H2** | 2xl-3xl | Semibold (600) | Tight (1.25) | Section headers |
| **H3** | xl-2xl | Semibold (600) | Snug (1.375) | Subsection headers |
| **H4** | lg-xl | Medium (500) | Snug (1.375) | Card titles, product names |
| **H5** | base-lg | Medium (500) | Normal (1.5) | Small section headers |
| **Body** | base | Normal (400) | Normal (1.5) | Main content, descriptions |
| **Small** | sm | Normal (400) | Normal (1.5) | Helper text, captions |
| **Tiny** | xs | Normal (400) | Normal (1.5) | Labels, badges, metadata |
| **Button** | sm-base | Medium (500) | None (1) | Button labels |
| **Link** | base | Medium (500) | Normal (1.5) | Text links |
| **Price** | lg-2xl | Bold (700) | Tight (1.25) | Product prices |

### Responsive Typography

```css
/* Mobile-first approach */
.heading-hero {
  font-size: var(--text-3xl);  /* 30px on mobile */
}

/* Tablet */
@media (min-width: 768px) {
  .heading-hero {
    font-size: var(--text-4xl);  /* 36px on tablet */
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .heading-hero {
    font-size: var(--text-5xl);  /* 48px on desktop */
  }
}
```

---

## Spacing & Layout

### Spacing Scale

Based on 4px base unit (0.25rem)

```css
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
--spacing-32: 8rem;     /* 128px */
```

### Layout Guidelines

#### Container Widths
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

#### Grid System
```css
--grid-cols-mobile: 4;     /* 4 columns on mobile */
--grid-cols-tablet: 8;     /* 8 columns on tablet */
--grid-cols-desktop: 12;   /* 12 columns on desktop */
--grid-gap: var(--spacing-4);  /* 16px gap */
```

#### Common Spacing Patterns

**Component Padding:**
- Small components (buttons, inputs): `--spacing-2` to `--spacing-4`
- Medium components (cards): `--spacing-4` to `--spacing-6`
- Large components (modals, sections): `--spacing-6` to `--spacing-8`

**Component Gaps:**
- Tight (form fields, list items): `--spacing-2` (8px)
- Normal (card grids): `--spacing-4` (16px)
- Relaxed (page sections): `--spacing-8` to `--spacing-12` (32-48px)

**Vertical Rhythm:**
- Paragraph spacing: `--spacing-4` (16px)
- Section spacing: `--spacing-12` to `--spacing-16` (48-64px)
- Page padding: `--spacing-6` to `--spacing-8` (24-32px)

---

## Elevation & Shadows

### Shadow Scale

```css
--shadow-none: none;
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1),
               0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1),
             0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1),
             0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1),
             0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
--shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
```

### Shadow Usage

| Level | Shadow | Use Cases |
|-------|--------|-----------|
| **0** | None | Flush elements, disabled states |
| **1** | sm | Input fields, subtle borders |
| **2** | base | Default cards, product tiles |
| **3** | md | Hover states, dropdowns |
| **4** | lg | Modals, popovers, floating elements |
| **5** | xl | Dialog overlays |
| **6** | 2xl | Hero images, important announcements |
| **Inner** | inner | Pressed states, input focus |

### Interactive States

```css
/* Default */
.card {
  box-shadow: var(--shadow-base);
  transition: box-shadow 0.2s ease;
}

/* Hover */
.card:hover {
  box-shadow: var(--shadow-md);
}

/* Active/Pressed */
.card:active {
  box-shadow: var(--shadow-sm);
}
```

---

## Border Radius

### Radius Scale

```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-3xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Fully rounded */
```

### Radius Usage

| Component | Radius | Rationale |
|-----------|--------|-----------|
| **Buttons** | md-lg (6-8px) | Friendly, clickable |
| **Input Fields** | md (6px) | Consistent with buttons |
| **Cards** | lg-xl (8-12px) | Modern, clean |
| **Badges** | full | Pill shape, distinctive |
| **Modals** | xl-2xl (12-16px) | Softer, premium feel |
| **Product Images** | lg (8px) | Professional, not harsh |
| **Avatars** | full | Circular, standard |
| **Tooltips** | md (6px) | Subtle, unobtrusive |

---

## Breakpoints

### Responsive Breakpoints

```css
--breakpoint-sm: 640px;   /* Mobile landscape, small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### Usage in Media Queries

```css
/* Mobile-first (default styles for mobile) */
.grid {
  grid-template-columns: 1fr;
}

/* Tablet */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Common Patterns

**Product Grid:**
- Mobile: 1-2 columns
- Tablet: 2-3 columns
- Desktop: 3-4 columns
- Large: 4-5 columns

**Navigation:**
- Mobile: Hamburger menu
- Tablet: Horizontal menu (compact)
- Desktop: Full horizontal menu with dropdowns

---

## Animation & Transitions

### Timing Functions

```css
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Duration Scale

```css
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-medium: 300ms;
--duration-slow: 500ms;
```

### Common Transitions

```css
/* Hover effects */
.button {
  transition: background-color var(--duration-base) var(--ease-out),
              box-shadow var(--duration-base) var(--ease-out);
}

/* Modal/Drawer animations */
.modal {
  transition: opacity var(--duration-medium) var(--ease-in-out),
              transform var(--duration-medium) var(--ease-out);
}

/* Loading states */
.skeleton {
  animation: pulse 2s var(--ease-in-out) infinite;
}
```

### Animation Guidelines

1. **Performance:** Animate only `transform` and `opacity` when possible
2. **Purpose:** Every animation should enhance UX, not just decoration
3. **Accessibility:** Respect `prefers-reduced-motion`
4. **Duration:** Keep most animations under 300ms

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accessibility Guidelines

### Color Contrast

**Text:**
- Normal text (< 18px): Minimum 4.5:1
- Large text (≥ 18px): Minimum 3:1
- UI components: Minimum 3:1

**Testing:** Use browser dev tools or online contrast checkers

### Focus States

```css
/* Visible focus indicators */
.interactive:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Remove default focus for mouse users */
.interactive:focus:not(:focus-visible) {
  outline: none;
}
```

### Touch Targets

- Minimum size: 44x44px (iOS/Android guidelines)
- Spacing between targets: Minimum 8px
- Mobile buttons: Prefer larger (48px+)

### Semantic HTML

```html
<!-- Good: Semantic structure -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/products">Products</a></li>
  </ul>
</nav>

<!-- Good: ARIA labels for screen readers -->
<button aria-label="Add Laptop Dell XPS 15 to cart">
  <svg aria-hidden="true">...</svg>
  Add to Cart
</button>

<!-- Good: Form labels -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email" required>
```

### Screen Reader Support

1. **Alt Text:** All images must have descriptive alt text
2. **ARIA Labels:** Use when visual labels aren't present
3. **Live Regions:** Announce dynamic updates
4. **Skip Links:** Allow keyboard users to skip navigation

```html
<!-- Skip link (hidden visually, visible on focus) -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

### Keyboard Navigation

**All interactive elements must be keyboard accessible:**
- Tab: Navigate forward
- Shift+Tab: Navigate backward
- Enter/Space: Activate buttons
- Escape: Close modals/dropdowns
- Arrow keys: Navigate within components (tabs, carousels)

---

## Theming & Customization

### CSS Variables Structure

All design tokens are defined as CSS variables for easy customization:

```css
:root {
  /* Colors */
  --color-primary-500: #0ea5e9;
  --color-secondary-500: #a855f7;

  /* Typography */
  --font-sans: 'Inter', sans-serif;
  --text-base: 1rem;

  /* Spacing */
  --spacing-4: 1rem;

  /* Shadows */
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1);

  /* Radius */
  --radius-md: 0.375rem;
}
```

### Quick Theme Customization

To change the brand colors, update only the primary/secondary values:

```css
:root {
  /* Example: Purple theme */
  --color-primary-500: #8b5cf6;
  --color-primary-600: #7c3aed;
  --color-primary-700: #6d28d9;

  /* Example: Green theme */
  --color-secondary-500: #10b981;
  --color-secondary-600: #059669;
  --color-secondary-700: #047857;
}
```

### Dark Mode Support (Optional)

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-neutral-50: #0a0a0a;
    --color-neutral-900: #fafafa;
    /* Invert neutral scale */
  }
}
```

### Tailwind CSS Integration

The design system maps directly to Tailwind CSS configuration:

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          500: 'var(--color-primary-500)',
          // ... rest of scale
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      spacing: {
        // Inherits from Tailwind's default 4px scale
      },
    },
  },
};
```

---

## Next Steps

1. **Review and Customize:** Adjust colors, typography to match brand (when defined)
2. **Implement Components:** Build atomic components following this system
3. **Test Accessibility:** Ensure all components meet WCAG 2.1 AA
4. **Document Patterns:** Add component-specific guidelines as they're built
5. **Iterate:** Refine based on user testing and feedback

---

**Maintained by:** UX/UI Design Team
**Questions?** Refer to component specifications in `components-spec.md`
