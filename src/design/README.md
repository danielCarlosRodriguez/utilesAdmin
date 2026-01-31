# Design System Documentation

This directory contains design system documentation, guidelines, and resources.

## Contents

- Design tokens (colors, typography, spacing)
- Component specifications
- Accessibility guidelines
- Brand assets (when defined)
- Style guide

## Design Tokens

All design tokens are defined in `src/style/theme.css` and `tailwind.config.js`.

### Colors

The color system is designed to be easily customizable:

- **Primary**: Main brand color (currently blue)
- **Secondary**: Supporting brand color (currently purple)
- **Accent**: Accent color for highlights (currently yellow)
- **Semantic**: Success, Warning, Error, Info
- **Neutral**: Grayscale palette

To change the brand colors, update the color values in `tailwind.config.js`.

### Typography

- **Font Family**:
  - Sans: Inter (body text)
  - Display: Lexend (headings)
  - Mono: JetBrains Mono (code)

- **Font Sizes**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl

- **Font Weights**: light, normal, medium, semibold, bold, extrabold

### Spacing

Based on 4px grid system:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 40px
- 3xl: 48px

### Shadows (Elevations)

Material Design inspired elevation system:
- elevation-1: Subtle shadow
- elevation-2: Card shadow
- elevation-3: Dropdown shadow
- elevation-4: Modal shadow
- elevation-5: Highest elevation

## Responsive Breakpoints

Mobile-first approach:

```
xs:  475px   (Extra small devices)
sm:  640px   (Small devices)
md:  768px   (Medium devices - tablets)
lg:  1024px  (Large devices - desktops)
xl:  1280px  (Extra large devices)
2xl: 1536px  (2X extra large devices)
```

## Accessibility Guidelines

### Color Contrast

All color combinations meet WCAG 2.1 AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text (18px+): 3:1 contrast ratio

### Keyboard Navigation

All interactive elements must be:
- Focusable with Tab key
- Activatable with Enter/Space
- Have visible focus indicators

### Screen Readers

- Use semantic HTML
- Include ARIA labels where needed
- Provide alt text for images
- Use proper heading hierarchy

### Focus Management

- Visible focus indicators (2px ring)
- Logical tab order
- Skip to main content link
- Modal focus trapping

## Component States

All interactive components should have:
1. **Default**: Normal state
2. **Hover**: Mouse over
3. **Active**: Being clicked/pressed
4. **Focus**: Keyboard focus
5. **Disabled**: Non-interactive
6. **Loading**: Processing

## Animation Guidelines

- **Duration**:
  - Fast: 150ms (micro-interactions)
  - Base: 200ms (most transitions)
  - Slow: 300ms (complex animations)

- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)

- **Respect prefers-reduced-motion**

## Customization Guide

### Changing Brand Colors

1. Update colors in `tailwind.config.js`:

```js
colors: {
  primary: {
    500: '#YOUR_COLOR',
    // ... other shades
  },
}
```

2. Update CSS variables in `src/style/theme.css`:

```css
:root {
  --color-primary-500: YOUR_RGB_VALUES;
}
```

### Adding Custom Fonts

1. Import fonts in `index.html` or `main.jsx`
2. Update font family in `tailwind.config.js`
3. Update CSS variable in `theme.css`

### Creating Custom Components

Follow the Atomic Design pattern:
1. Create in appropriate directory (atoms/molecules/organisms)
2. Use existing design tokens
3. Ensure accessibility
4. Document with JSDoc comments
5. Export from index.js

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref)
- [Material Design](https://material.io/design)
