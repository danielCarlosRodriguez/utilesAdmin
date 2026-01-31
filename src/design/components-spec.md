# Component Specifications - E-Commerce Platform

**Version:** 1.0.0
**Last Updated:** 2025-11-13
**Design System:** See `design-system.md`

---

## Table of Contents

1. [Atomic Design Structure](#atomic-design-structure)
2. [Atoms](#atoms)
3. [Molecules](#molecules)
4. [Organisms](#organisms)
5. [Templates](#templates)
6. [Component Priority Matrix](#component-priority-matrix)

---

## Atomic Design Structure

This e-commerce platform follows Atomic Design methodology:

```
Atoms → Molecules → Organisms → Templates → Pages
```

**Atoms:** Basic building blocks (buttons, inputs, icons)
**Molecules:** Simple component groups (search bar, product card)
**Organisms:** Complex UI sections (header, product grid, checkout form)
**Templates:** Page-level layouts (home template, product detail template)
**Pages:** Specific instances with real content

---

## Atoms

### 1. Button

**Purpose:** Primary interactive element for actions

**Variants:**
```
- primary: Main CTAs (Add to Cart, Checkout)
- secondary: Alternative actions (View Details, Save for Later)
- outline: Tertiary actions (Cancel, Back)
- ghost: Minimal actions (Navigation, Close)
- link: Text-style buttons
```

**Sizes:**
```
- sm: 32px height, text-sm, px-3
- md: 40px height, text-base, px-4 (default)
- lg: 48px height, text-lg, px-6
- xl: 56px height, text-xl, px-8
```

**States:**
```
- default: Base appearance
- hover: Primary-600, shadow-md, cursor-pointer
- active: Primary-700, shadow-sm
- disabled: Neutral-300 bg, neutral-500 text, cursor-not-allowed
- loading: Disabled + spinner icon
```

**Accessibility:**
- Minimum touch target: 44x44px
- Focus-visible outline
- Keyboard accessible (Enter/Space)
- ARIA label for icon-only buttons

**Markup Example:**
```jsx
<Button
  variant="primary"
  size="md"
  disabled={false}
  loading={false}
  onClick={handleClick}
  aria-label="Add product to cart"
>
  Add to Cart
</Button>
```

**Visual Specs:**
```css
/* Primary Button */
background: var(--color-primary-500);
color: white;
padding: var(--spacing-2) var(--spacing-4);
border-radius: var(--radius-md);
font-weight: var(--font-medium);
box-shadow: var(--shadow-sm);
transition: all var(--duration-base) var(--ease-out);
```

---

### 2. Input

**Purpose:** Text input for forms (search, email, address)

**Variants:**
```
- text: Default text input
- email: Email validation
- password: Hidden text
- number: Numeric input
- search: With search icon
- textarea: Multi-line text
```

**Sizes:**
```
- sm: 32px height
- md: 40px height (default)
- lg: 48px height
```

**States:**
```
- default: Neutral-200 border
- focus: Primary-500 border, shadow-sm
- error: Error-500 border, error message below
- disabled: Neutral-100 bg, neutral-400 text
- success: Success-500 border (optional validation)
```

**Features:**
- Floating label (optional)
- Leading/trailing icons
- Helper text
- Character counter (for limited fields)
- Clear button (for search)

**Accessibility:**
- Associated label (visible or aria-label)
- Error messages linked via aria-describedby
- Keyboard accessible
- Autocomplete attributes

**Markup Example:**
```jsx
<Input
  type="email"
  label="Email Address"
  placeholder="you@example.com"
  error="Please enter a valid email"
  required
  icon={<EmailIcon />}
  helper="We'll never share your email"
/>
```

---

### 3. Badge

**Purpose:** Small status indicators, labels, counters

**Variants:**
```
- default: Neutral background
- primary: Brand color
- success: Green (In Stock)
- error: Red (Out of Stock)
- warning: Yellow (Low Stock)
- sale: Red-orange (On Sale)
- new: Secondary color (New Arrival)
```

**Sizes:**
```
- sm: text-xs, px-2, py-0.5
- md: text-sm, px-2.5, py-1 (default)
- lg: text-base, px-3, py-1.5
```

**Shapes:**
```
- rounded: radius-full (pill shape)
- square: radius-md
- dot: Circle with no text (notification indicator)
```

**Markup Example:**
```jsx
<Badge variant="success" size="sm">In Stock</Badge>
<Badge variant="sale" size="md">-20%</Badge>
<Badge variant="new">New</Badge>
<Badge variant="dot" count={5} /> {/* Cart counter */}
```

---

### 4. Icon

**Purpose:** Visual symbols for actions and states

**Library:** Heroicons, Lucide, or Font Awesome (to be decided)

**Sizes:**
```
- xs: 12px (1rem * 0.75)
- sm: 16px (1rem)
- md: 20px (1.25rem)
- lg: 24px (1.5rem)
- xl: 32px (2rem)
```

**Common Icons Needed:**
```
Navigation:
- Home, Search, ShoppingCart, User, Menu, Close

Product Actions:
- Heart (Wishlist), Star (Rating), Share, Eye (View)

Status:
- Check (Success), X (Error), Info, Alert, Truck (Shipping)

Arrows:
- ChevronLeft, ChevronRight, ChevronDown, ArrowLeft, ArrowRight

E-commerce:
- CreditCard, Lock (Secure), Filter, SortAscending, SortDescending
```

**Accessibility:**
- aria-hidden="true" for decorative icons
- Paired with text or aria-label for interactive icons

---

### 5. Link

**Purpose:** Navigation and text links

**Variants:**
```
- primary: Brand color, underline on hover
- secondary: Neutral color, subtle
- nav: Navigation links (header, footer)
- inline: Within paragraphs
```

**States:**
```
- default: Primary-600 text
- hover: Primary-700, underline
- active: Primary-800
- visited: Primary-900 (optional)
- disabled: Neutral-400, no pointer
```

**Accessibility:**
- Descriptive text (avoid "Click here")
- Keyboard accessible
- Focus-visible outline

---

### 6. Image

**Purpose:** Product images, category banners, user avatars

**Variants:**
```
- product: Product photos with aspect ratio
- avatar: User profile pictures (circular)
- banner: Full-width promotional images
- thumbnail: Small preview images
```

**Features:**
- Lazy loading (loading="lazy")
- Fallback placeholder (skeleton or icon)
- Alt text required
- Aspect ratio container (prevent layout shift)
- Zoom on hover (product images)

**Aspect Ratios:**
```
- square: 1:1 (product thumbnails, avatars)
- landscape: 4:3 or 16:9 (banners)
- portrait: 3:4 (product detail)
```

**Markup Example:**
```jsx
<Image
  src="https://res.cloudinary.com/..."
  alt="Laptop Dell XPS 15"
  aspectRatio="1:1"
  loading="lazy"
  fallback={<ImagePlaceholder />}
  onError={handleImageError}
/>
```

---

### 7. Typography Components

**Heading (H1-H6)**
- Semantic HTML tags
- Consistent sizing from design system
- Responsive font sizes

**Text/Paragraph**
- Body text with proper line height
- Support for truncation (ellipsis)
- Text color variants

**Label**
- Form field labels
- Required indicator (*)
- Helper text styling

---

### 8. Skeleton Loader

**Purpose:** Loading placeholders for async content

**Variants:**
```
- text: Rectangular bars (for text lines)
- circle: Circular (for avatars)
- rectangle: Product cards, images
```

**Animation:**
- Pulse animation (2s infinite)
- Shimmer effect (optional, more complex)

**Usage:**
- Product cards while loading
- User profile while fetching
- Text content placeholders

---

### 9. Divider

**Purpose:** Visual separator between sections

**Variants:**
```
- horizontal: Full width or contained
- vertical: Between inline elements
- text: With centered text label
```

**Styles:**
```
- solid: 1px solid neutral-200
- dashed: 1px dashed neutral-300
- gradient: Fade effect
```

---

### 10. Spinner/Loader

**Purpose:** Loading indicator for async operations

**Variants:**
```
- spinner: Rotating circle
- dots: Bouncing dots
- bar: Linear progress bar
```

**Sizes:**
```
- sm: 16px
- md: 24px
- lg: 40px
```

**Colors:**
- Primary (default)
- Neutral (subtle)
- White (on dark backgrounds)

---

## Molecules

### 1. Search Bar

**Components:** Input (text) + Icon (search) + Button (submit, optional)

**Features:**
- Autocomplete dropdown
- Recent searches
- Clear button
- Loading state while searching
- Mobile: Expands on focus, full width

**States:**
```
- idle: Collapsed (mobile) or visible (desktop)
- focus: Expanded, dropdown visible
- loading: Spinner icon
- results: Dropdown with product suggestions
```

**Accessibility:**
- Combobox ARIA role
- Keyboard navigation (arrows, enter, escape)
- Screen reader announcements for results

**Markup Example:**
```jsx
<SearchBar
  placeholder="Search products..."
  onSearch={handleSearch}
  suggestions={suggestedProducts}
  isLoading={false}
  recentSearches={["laptop", "mouse"]}
/>
```

---

### 2. Product Card

**Components:** Image + Badge (sale/new) + Title (Link) + Price + Rating + Button (Add to Cart)

**Variants:**
```
- grid: Vertical layout (default for product listings)
- list: Horizontal layout (alternative view)
- compact: Minimal version (related products)
- featured: Larger, more detail (homepage)
```

**Visual Structure:**
```
┌─────────────────────┐
│   [Product Image]   │ ← Aspect ratio 1:1 or 4:3
│   [Sale Badge]      │ ← Top-right corner
├─────────────────────┤
│ Product Name        │ ← H4, truncate to 2 lines
│ ⭐⭐⭐⭐⭐ (42)      │ ← Rating + review count
│ $99.99  $129.99     │ ← Price + compare price (strikethrough)
├─────────────────────┤
│ [Add to Cart]       │ ← Primary button
│ [Wishlist Icon]     │ ← Ghost button (top-left or bottom)
└─────────────────────┘
```

**States:**
```
- default: Normal appearance
- hover: Image zoom, shadow-md, "Quick View" overlay
- out-of-stock: Grayscale filter, "Out of Stock" badge, disabled button
- loading: Skeleton loader
```

**Features:**
- Quick view button (hover overlay)
- Wishlist toggle (heart icon)
- Color/size variants preview (if applicable)
- Stock indicator badge
- Discount percentage badge

**Accessibility:**
- Product name as H4 with link to detail page
- Alt text for product image
- Price announced to screen readers
- Keyboard accessible actions

---

### 3. Price Display

**Components:** Price (number) + Compare Price (optional) + Discount Badge (optional)

**Variants:**
```
- default: Just the price
- sale: Price + strikethrough compare price + discount %
- range: Min-Max price (for variants)
```

**Format:**
```
$99.99        → Single price
$99.99 $129.99 → Sale price + compare price
$49.99 - $199.99 → Price range
```

**Features:**
- Currency symbol (configurable)
- Locale formatting (1,299.99 vs 1.299,99)
- Semantic markup (del for old price)

**Markup Example:**
```jsx
<Price
  current={99.99}
  compare={129.99}
  discount={20}
  currency="USD"
  locale="en-US"
/>
```

---

### 4. Rating Stars

**Components:** Star icons (5) + Rating value + Review count (optional)

**Display:**
```
⭐⭐⭐⭐⭐ 4.5 (128 reviews)
⭐⭐⭐⭐☆ 4.0
⭐⭐⭐☆☆ 3.0
```

**Features:**
- Half-star support (4.5 → 4 filled + 1 half)
- Clickable for filtering by rating
- Read-only vs editable (for review forms)

**Variants:**
```
- display: Read-only, show average
- input: Clickable for user reviews
- compact: No text, just stars
```

**Accessibility:**
- Screen reader text: "Rated 4.5 out of 5 stars"
- Keyboard navigable (for input variant)

---

### 5. Quantity Selector

**Components:** Button (decrease) + Input (number) + Button (increase)

**Visual:**
```
[ - ]  [ 2 ]  [ + ]
```

**Features:**
- Min/max constraints
- Disable decrease at min (usually 1)
- Disable increase at max (stock limit)
- Manual input with validation
- Keyboard accessible (arrow keys)

**States:**
```
- default: Normal
- disabled: Grayed out
- error: Red border if invalid input
```

**Markup Example:**
```jsx
<QuantitySelector
  value={2}
  min={1}
  max={10}
  onChange={handleQuantityChange}
/>
```

---

### 6. Form Field Group

**Components:** Label + Input + Helper Text + Error Message

**Visual:**
```
Email Address *
┌─────────────────────┐
│ you@example.com     │
└─────────────────────┘
We'll never share your email   ← Helper text
⚠️ Please enter a valid email   ← Error (conditional)
```

**States:**
- Idle: Helper text visible
- Focus: Highlight border
- Error: Error message replaces helper text
- Success: Green check icon (optional)

**Accessibility:**
- Label linked to input (htmlFor/id)
- Required indicator in label
- Error message via aria-describedby
- Helper text via aria-describedby

---

### 7. Breadcrumb

**Components:** Links separated by dividers (chevrons or slashes)

**Visual:**
```
Home > Electronics > Laptops > Dell XPS 15
```

**Features:**
- Responsive: Collapse on mobile (show only last 2 levels)
- Clickable links (except current page)
- Structured data (JSON-LD for SEO)

**Accessibility:**
- nav element with aria-label="Breadcrumb"
- Current page: aria-current="page"

---

### 8. Tag/Chip

**Components:** Text + Close button (optional)

**Use Cases:**
- Active filters (removable)
- Product tags (keywords)
- Selected categories

**Variants:**
```
- static: No close button
- removable: With X icon
- clickable: Selectable/togglable
```

**Visual:**
```
[  Wireless  X  ]  [  Gaming  X  ]  [  On Sale  X  ]
```

---

### 9. Toast/Alert

**Components:** Icon + Message + Close button

**Variants:**
```
- success: Green (Order placed successfully)
- error: Red (Payment failed)
- warning: Yellow (Low stock warning)
- info: Blue (Promo code applied)
```

**Position:**
- Top-right (desktop)
- Bottom (mobile)

**Behavior:**
- Auto-dismiss after 5 seconds (configurable)
- Swipe to dismiss (mobile)
- Stack multiple toasts

**Accessibility:**
- ARIA live region (role="alert")
- Announced to screen readers
- Keyboard dismissible (focus + enter/escape)

---

### 10. Pagination

**Components:** Buttons (prev/next) + Page numbers + Jump to page

**Visual:**
```
[< Prev]  1  2  3  ...  10  [Next >]
```

**Features:**
- Show current page (bold, primary color)
- Ellipsis for large page counts
- Disable prev/next at boundaries
- Keyboard accessible

**Variants:**
```
- numbered: Show page numbers
- simple: Just prev/next
- load-more: Button to append results
- infinite: Auto-load on scroll
```

---

## Organisms

### 1. Header/Navbar

**Components:** Logo + Navigation Links + Search Bar + Cart Icon + User Menu

**Layout (Desktop):**
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]  Home  Products  Categories  │ [Search] │ 🛒 (3) 👤 │
└─────────────────────────────────────────────────────────────┘
```

**Layout (Mobile):**
```
┌─────────────────────────────────────┐
│ ☰  [Logo]           🔍  🛒 (3)  👤 │
└─────────────────────────────────────┘
```

**Features:**
- Sticky header (fixed on scroll)
- Mobile: Hamburger menu (drawer)
- Search: Expandable on focus (mobile)
- Cart icon: Badge with item count
- User menu: Dropdown (login/logout, orders, profile)
- Categories: Mega menu (desktop) or accordion (mobile)

**States:**
- Scrolled: Condensed height, shadow
- Search active: Full-width search bar
- Menu open: Drawer visible

**Accessibility:**
- Skip link to main content
- Keyboard navigation (tab, arrows)
- ARIA labels for icons

---

### 2. Product Grid/List

**Components:** Product Cards + Filters + Sort Dropdown + Pagination

**Layout:**
```
┌────────────┬──────────────────────────────────────────┐
│            │  Sort: [Featured ▾]         Grid/List ⊞⊟│
│  Filters   ├──────────────────────────────────────────┤
│            │  [Card] [Card] [Card] [Card]             │
│ Category   │  [Card] [Card] [Card] [Card]             │
│ ☑ Laptops  │  [Card] [Card] [Card] [Card]             │
│ ☐ Tablets  │                                          │
│            │  [< Prev]  1  2  3  [Next >]             │
│ Price      │                                          │
│ $0 - $2000 │                                          │
│            │                                          │
│ Rating     │                                          │
│ ⭐⭐⭐⭐+  │                                          │
└────────────┴──────────────────────────────────────────┘
```

**Features:**
- Responsive grid (1/2/3/4 columns)
- Toggle grid/list view
- Applied filters displayed as chips (removable)
- Load more or pagination
- Empty state (no results)
- Loading state (skeleton cards)

**Filters:**
- Category (checkboxes)
- Price range (slider or inputs)
- Rating (star filter)
- Brand (checkboxes)
- Stock (toggle: in stock only)
- Tags (chips)

**Sort Options:**
- Featured (default)
- Price: Low to High
- Price: High to Low
- Newest
- Best Selling
- Highest Rated

**Mobile:**
- Filters in bottom sheet or drawer
- "Filter & Sort" button to open
- Applied filters count badge

---

### 3. Product Detail Section

**Components:** Image Gallery + Product Info + Add to Cart Form + Tabs (Description/Reviews/Specs)

**Layout:**
```
┌─────────────────────┬────────────────────────────────┐
│                     │  Laptop Dell XPS 15            │
│   [Main Image]      │  ⭐⭐⭐⭐⭐ 4.5 (42 reviews) │
│                     │                                │
│  [🔍] Zoom          │  $1,299.99  $1,499.99  -13%    │
│                     │                                │
│ [Thumb][Thumb][...]  │  [Sale] [Free Shipping]        │
│                     │                                │
│                     │  In Stock (15 available)       │
│                     │                                │
│                     │  Quantity: [ - ] 1 [ + ]       │
│                     │                                │
│                     │  [Add to Cart]  [♡ Wishlist]  │
│                     │                                │
│                     │  ✓ Free returns                │
│                     │  ✓ Secure checkout             │
└─────────────────────┴────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ [Description] [Specifications] [Reviews]                 │
├─────────────────────────────────────────────────────────┤
│ (Tab content)                                            │
└─────────────────────────────────────────────────────────┘
```

**Image Gallery:**
- Main image (large, zoomable)
- Thumbnails below or side
- Lightbox on click
- Arrow navigation

**Product Info:**
- Name (H1)
- Rating + review link
- Price (current + compare)
- Badges (sale, free shipping, new)
- Stock status
- Quantity selector
- Add to cart button
- Wishlist button
- Trust badges (returns, secure)

**Tabs:**
- Description: Rich text, features, benefits
- Specifications: Table of technical details
- Reviews: List of customer reviews + submit form

**Mobile:**
- Stacked layout (image, then info)
- Sticky add to cart bar at bottom
- Tabs collapse to accordion

**Accessibility:**
- Image gallery keyboard navigable
- Alt text for all images
- Form labels and validation
- ARIA tabs for tabbed content

---

### 4. Shopping Cart

**Components:** Cart Items + Summary + Checkout Button

**Layout:**
```
┌──────────────────────────────────┬──────────────────┐
│ Shopping Cart (3 items)          │   Order Summary  │
├──────────────────────────────────┤                  │
│ [Image] Laptop Dell XPS 15       │  Subtotal: $1,579│
│         $1,299.99                │  Shipping: $0    │
│         Qty: [ - ] 1 [ + ]  [X]  │  Tax: $0         │
├──────────────────────────────────┤  ────────────────│
│ [Image] Mouse Logitech MX3       │  Total: $1,579   │
│         $89.99                   │                  │
│         Qty: [ - ] 2 [ + ]  [X]  │  [Checkout]      │
├──────────────────────────────────┤                  │
│ ...                              │  [Continue Shop] │
└──────────────────────────────────┴──────────────────┘
```

**Cart Item:**
- Product image (thumbnail)
- Product name (link to detail)
- Price (per unit)
- Quantity selector
- Subtotal (price * quantity)
- Remove button

**Summary:**
- Subtotal
- Shipping (calculated or free)
- Tax (if applicable)
- Discount (if coupon applied)
- Total
- Checkout button (primary, large)
- Continue shopping link

**Features:**
- Update quantity (live update totals)
- Remove item (with undo toast)
- Empty state ("Your cart is empty")
- Save for later (optional)
- Related products (optional)

**Mobile:**
- Stacked layout
- Summary sticky at bottom

**Accessibility:**
- Announce total updates to screen readers
- Keyboard accessible quantity changes
- Confirm before removing items

---

### 5. Checkout Form

**Components:** Shipping Address Form + Payment Method + Order Review + Submit

**Steps:**
```
1. Shipping → 2. Payment → 3. Review → 4. Confirmation
   [●]           [○]          [○]          [○]
```

**Layout (Step 1: Shipping):**
```
┌───────────────────────────────────────────────────┐
│ Shipping Address                                  │
├───────────────────────────────────────────────────┤
│ Full Name *          ┌────────────────────────┐   │
│                      │ Juan Pérez             │   │
│                      └────────────────────────┘   │
│ Email *              ┌────────────────────────┐   │
│                      │ juan@example.com       │   │
│                      └────────────────────────┘   │
│ Phone *              ┌────────────────────────┐   │
│                      │ +54 11 1234-5678       │   │
│                      └────────────────────────┘   │
│ Street Address *     ┌────────────────────────┐   │
│                      │ Av. Corrientes 1234    │   │
│                      └────────────────────────┘   │
│ City *     State *           Zip Code *           │
│ [Buenos ]  [CABA  ]          [C1043   ]           │
│                                                    │
│               [Continue to Payment →]              │
└───────────────────────────────────────────────────┘
```

**Features:**
- Multi-step with progress indicator
- Form validation (client + server)
- Save address for later (logged in users)
- Address autocomplete (Google Places API, optional)
- Guest checkout option
- Shipping method selection (if multiple)
- Payment method cards (credit card, PayPal, etc.)
- Order summary sidebar (sticky)

**Accessibility:**
- Form field labels and errors
- Required field indicators
- Error summary at top of form
- Focus management between steps

---

### 6. Footer

**Components:** Logo + Links (columns) + Social Media + Newsletter Signup

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ [Logo]                                                  │
│                                                         │
│ Shop          Help          Company        Newsletter  │
│ Products      FAQs          About Us       Subscribe   │
│ Categories    Shipping      Careers        [Email    ] │
│ New Arrivals  Returns       Contact        [Sign Up  ] │
│ Sale          Track Order   Privacy                    │
│                                                         │
│ ─────────────────────────────────────────────────────  │
│ © 2025 E-Commerce. All rights reserved.                │
│ [FB] [TW] [IG] [YT]                                    │
└─────────────────────────────────────────────────────────┘
```

**Link Columns:**
- Shop (Products, Categories, Sale)
- Help (FAQs, Shipping, Returns, Contact)
- Company (About, Careers, Privacy, Terms)
- Follow Us (Social media icons)

**Newsletter:**
- Email input + submit button
- Privacy note ("We respect your privacy")

**Mobile:**
- Accordion columns (collapsible)
- Stacked layout

---

### 7. User Menu Dropdown

**Components:** Avatar + Name + Links (Profile, Orders, Logout)

**Logged Out:**
```
┌─────────────────┐
│ Login           │
│ Sign Up         │
└─────────────────┘
```

**Logged In:**
```
┌─────────────────┐
│ Juan Pérez      │
│ juan@example.com│
├─────────────────┤
│ My Orders       │
│ Profile         │
│ Settings        │
├─────────────────┤
│ Logout          │
└─────────────────┘
```

**Features:**
- Avatar (profile picture or initials)
- Dropdown on click (desktop)
- Full-page menu (mobile)
- Google OAuth login button

---

### 8. Filter Sidebar

**Components:** Category Checkboxes + Price Slider + Rating Filter + Apply/Clear Buttons

**Layout:**
```
┌──────────────────────┐
│ Filters         [X]  │
├──────────────────────┤
│ Category             │
│ ☑ Laptops (42)       │
│ ☐ Tablets (28)       │
│ ☐ Phones (156)       │
├──────────────────────┤
│ Price Range          │
│ $0 ══●═════ $2000    │
│ Min: $0   Max: $1500 │
├──────────────────────┤
│ Rating               │
│ ○ 4 stars & up (32)  │
│ ○ 3 stars & up (78)  │
├──────────────────────┤
│ Brand                │
│ ☑ Dell (12)          │
│ ☑ HP (8)             │
│ ☐ Lenovo (15)        │
├──────────────────────┤
│ Stock                │
│ ☑ In Stock Only      │
├──────────────────────┤
│ [Clear] [Apply (5)]  │
└──────────────────────┘
```

**Features:**
- Expandable sections (accordion)
- Counts next to options
- Clear all filters
- Mobile: Bottom sheet or drawer
- Applied filters: Chips above product grid

---

### 9. Reviews Section

**Components:** Review List + Rating Distribution + Submit Review Form

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ Customer Reviews                                    │
├─────────────────────────────────────────────────────┤
│ ⭐⭐⭐⭐⭐ 4.5 out of 5 (42 reviews)               │
│                                                     │
│ 5 ⭐ ███████████████████ 80%  (34)                 │
│ 4 ⭐ ████ 15%  (6)                                  │
│ 3 ⭐ █ 5%  (2)                                      │
│ 2 ⭐ 0%  (0)                                        │
│ 1 ⭐ 0%  (0)                                        │
│                                                     │
│ [Write a Review]                                    │
├─────────────────────────────────────────────────────┤
│ ⭐⭐⭐⭐⭐  "Excellent laptop!"                     │
│ John D. - Verified Purchase - Nov 10, 2025         │
│ Amazing performance, fast delivery...              │
│ [Helpful (12)] [Report]                            │
├─────────────────────────────────────────────────────┤
│ ⭐⭐⭐⭐☆  "Great, but expensive"                   │
│ Sarah M. - Verified Purchase - Nov 8, 2025         │
│ ...                                                 │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Overall rating summary
- Rating distribution bars
- Review list (paginated or load more)
- Sort reviews (most helpful, newest, highest/lowest)
- Submit review (logged in users)
- Verified purchase badge
- Helpful voting

---

### 10. Order History Table

**Components:** Table + Status Badges + Action Buttons

**Layout:**
```
┌───────────────────────────────────────────────────────────┐
│ My Orders                                                 │
├────────────┬───────────┬────────┬──────────┬─────────────┤
│ Order #    │ Date      │ Total  │ Status   │ Actions     │
├────────────┼───────────┼────────┼──────────┼─────────────┤
│ ORD-00042  │ Nov 13    │ $1,299 │ [Shipped]│ [View][Track│
│ ORD-00039  │ Nov 10    │ $89.99 │ [Deliver]│ [View]      │
│ ORD-00031  │ Oct 28    │ $450   │ [Pending]│ [View][Cance│
└────────────┴───────────┴────────┴──────────┴─────────────┘
```

**Status Badges:**
- Pending (warning/yellow)
- Processing (info/blue)
- Shipped (primary)
- Delivered (success/green)
- Cancelled (error/red)

**Actions:**
- View Details (link to order detail page)
- Track Shipment (if shipped)
- Cancel Order (if pending/processing)

**Mobile:**
- Card layout instead of table
- Each order as a card

---

## Templates

### 1. Home Page Template

**Sections:**
- Hero Banner (carousel or static)
- Featured Categories (grid of 4-6)
- Featured Products (carousel or grid)
- Sale/Promo Banner
- New Arrivals (carousel)
- Testimonials/Reviews (optional)
- Newsletter Signup

**Layout:**
```
[Header]
[Hero: Full-width banner with CTA]
[Featured Categories: 4-column grid]
[Featured Products: 8 products, 4 per row]
[Promo Banner: "Free shipping over $100"]
[New Arrivals: Carousel]
[Footer]
```

---

### 2. Product List Page Template

**Layout:**
```
[Header]
[Breadcrumb]
[Page Title: "Laptops"]
[Filters Sidebar | Product Grid | Sort & View Toggle]
[Pagination]
[Footer]
```

---

### 3. Product Detail Page Template

**Layout:**
```
[Header]
[Breadcrumb]
[Product Detail Section: Image Gallery + Info]
[Tabs: Description, Specs, Reviews]
[Related Products: Carousel]
[Footer]
```

---

### 4. Cart Page Template

**Layout:**
```
[Header]
[Shopping Cart Organism]
[You May Also Like: Product carousel]
[Footer]
```

---

### 5. Checkout Page Template

**Layout:**
```
[Header: Minimal, logo + secure badge]
[Checkout Form: Multi-step | Order Summary Sidebar]
[Footer: Minimal, trust badges]
```

---

### 6. Order Confirmation Page Template

**Layout:**
```
[Header]
[Success Icon + "Order Confirmed!"]
[Order Summary: Items, total, shipping address]
[What's Next: Shipping info, track order link]
[Continue Shopping Button]
[Footer]
```

---

## Component Priority Matrix

### Phase 1: MVP (Must Have)

**Atoms:**
- Button
- Input
- Badge
- Icon
- Link
- Image
- Spinner

**Molecules:**
- Search Bar
- Product Card
- Price Display
- Rating Stars
- Quantity Selector
- Form Field Group
- Breadcrumb

**Organisms:**
- Header/Navbar
- Product Grid
- Product Detail Section
- Shopping Cart
- Checkout Form
- Footer

---

### Phase 2: Enhanced UX

**Atoms:**
- Skeleton Loader
- Divider
- Typography components

**Molecules:**
- Tag/Chip
- Toast/Alert
- Pagination

**Organisms:**
- User Menu Dropdown
- Filter Sidebar
- Reviews Section

---

### Phase 3: Advanced Features

**Organisms:**
- Order History Table
- Wishlist Grid
- Product Comparison Table
- Live Chat Widget (optional)

**New Atoms:**
- Tooltip
- Modal/Dialog
- Accordion

**New Molecules:**
- Image Zoom (Lightbox)
- Carousel/Slider
- Color/Size Selector (variants)

---

## Component States Reference

### Common States for All Interactive Components

```
1. Default: Base appearance
2. Hover: Visual feedback on pointer over
3. Active/Pressed: Visual feedback on click
4. Focus: Keyboard navigation indicator
5. Disabled: Not interactable, grayed out
6. Loading: Async operation in progress
7. Error: Validation failed or error state
8. Success: Validation passed or success state
```

---

## Naming Conventions

### Component Files

```
atoms/
  Button.jsx
  Input.jsx
  Badge.jsx

molecules/
  ProductCard.jsx
  SearchBar.jsx

organisms/
  Header.jsx
  ProductGrid.jsx
```

### CSS/Tailwind Classes

```
<!-- Base -->
.btn

<!-- Variants -->
.btn-primary
.btn-secondary

<!-- Sizes -->
.btn-sm
.btn-lg

<!-- States -->
.btn:hover
.btn:disabled
```

---

## Testing Checklist

For each component, ensure:

- [ ] Keyboard accessible
- [ ] Screen reader tested
- [ ] Color contrast passes WCAG AA
- [ ] Touch targets >= 44x44px
- [ ] Works on mobile (< 768px)
- [ ] Works on tablet (768-1024px)
- [ ] Works on desktop (> 1024px)
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Empty states handled

---

**Next Steps:**
1. Implement atoms in order of priority
2. Build molecules using atoms
3. Assemble organisms from molecules
4. Create page templates
5. Test accessibility at each level

**Reference:**
- Design System: `design-system.md`
- User Flows: `user-flows.md`
- API Documentation: `borrador/api-documentation.md`
