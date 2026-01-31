# User Flows - E-Commerce Platform

**Version:** 1.0.0
**Last Updated:** 2025-11-13
**Design System:** See `design-system.md`

---

## Table of Contents

1. [Flow Overview](#flow-overview)
2. [Primary Flows](#primary-flows)
3. [Authentication Flows](#authentication-flows)
4. [Product Discovery Flows](#product-discovery-flows)
5. [Purchase Flows](#purchase-flows)
6. [Account Management Flows](#account-management-flows)
7. [Error Handling & Edge Cases](#error-handling--edge-cases)

---

## Flow Overview

### User Types

**Guest User**
- Can browse products
- Can search and filter
- Can view product details
- Must log in to checkout

**Authenticated User**
- All guest capabilities
- Can add to cart (persistent)
- Can checkout
- Can view order history
- Can save addresses

**Admin User** (Future)
- All authenticated capabilities
- Can manage products
- Can manage orders
- Can view analytics

---

## Primary Flows

### 1. Happy Path: Browse → Purchase

**Goal:** User finds and purchases a product successfully

```
┌─────────────────────────────────────────────────────────────┐
│                    HAPPY PATH FLOW                          │
└─────────────────────────────────────────────────────────────┘

1. Landing
   ├─ Home Page
   │  ├─ View hero banner
   │  ├─ Browse featured categories
   │  └─ View featured products
   │
2. Product Discovery
   ├─ Click category OR search
   │  │
   │  ├─ [Category Click]
   │  │  └─ Product List Page (filtered)
   │  │
   │  └─ [Search]
   │     ├─ View autocomplete suggestions
   │     └─ Results page
   │
3. Product Exploration
   ├─ Product List Page
   │  ├─ Apply filters (price, rating, brand)
   │  ├─ Sort results
   │  └─ Click product card
   │
4. Product Detail
   ├─ View images (gallery, zoom)
   ├─ Read description
   ├─ Check stock status
   ├─ Select quantity
   └─ [Add to Cart] → Cart badge updates
   │
5. Cart Review
   ├─ Click cart icon (header)
   ├─ Review items
   ├─ Update quantities (optional)
   └─ [Proceed to Checkout]
   │
6. Authentication
   ├─ [Guest Checkout] → Continue as guest
   │  OR
   ├─ [Login with Google] → OAuth flow
   │  └─ Return to checkout
   │
7. Checkout
   ├─ Step 1: Shipping Address
   │  ├─ Fill form OR select saved address
   │  └─ [Continue to Payment]
   │
   ├─ Step 2: Payment Method
   │  ├─ Select payment (e.g., MercadoPago)
   │  └─ [Review Order]
   │
   ├─ Step 3: Review Order
   │  ├─ Verify items, address, total
   │  └─ [Place Order]
   │
8. Order Confirmation
   ├─ Success message
   ├─ Order number displayed
   ├─ Email confirmation sent
   └─ [Track Order] OR [Continue Shopping]
   │
9. Order Tracking (Post-purchase)
   ├─ My Orders page
   ├─ View order status
   └─ Track shipment (if shipped)

END
```

**Success Criteria:**
- User completes purchase in < 5 minutes
- No errors or confusion
- Order confirmed and stock reduced

---

## Authentication Flows

### 2. Google OAuth Login

**Goal:** User authenticates via Google

```
┌─────────────────────────────────────────────────────────────┐
│                   GOOGLE OAUTH FLOW                         │
└─────────────────────────────────────────────────────────────┘

User Action                    Frontend                Backend/Google
─────────────────────────────────────────────────────────────────
[Click "Login"]
    │
    ├─> Show login modal
    │   ├─ [Continue with Google]
    │   └─ [Guest Checkout]
    │
[Click "Continue with Google"]
    │
    ├─> Redirect to:
    │   /api/v1/auth/google ────────────────────> Initiate OAuth
    │                                                     │
    │   <──────────────────────────────────── Redirect to Google
    │                                          consent screen
    │
[User authorizes on Google]
    │                                                     │
    │   <──────────────────────────────────── Google callback
    │                                          with auth code
    │                                                     │
    │   <──────────────────────────────────── Backend creates
    │                                          user (if new)
    │                                          generates JWT
    │                                                     │
    ├─> Redirect to frontend
    │   with ?token=<jwt_token>
    │
    ├─> Save token to:
    │   - localStorage (persistent)
    │   - App state (current session)
    │
    ├─> Fetch user profile:
    │   GET /api/v1/auth/me ───────────────────> Return user data
    │
    ├─> Update UI:
    │   - Show user avatar/name
    │   - Enable "My Orders"
    │   - Sync cart from server
    │
    └─> Close modal / Redirect to
        original page OR checkout

END (User is authenticated)
```

**Edge Cases:**
- User cancels Google consent → Return to login modal
- Token expired → Redirect to login
- Network error → Show retry option

---

### 3. Guest Checkout

**Goal:** User checks out without creating account

```
┌─────────────────────────────────────────────────────────────┐
│                   GUEST CHECKOUT FLOW                       │
└─────────────────────────────────────────────────────────────┘

[Cart → Checkout]
    │
    ├─> Show auth options:
    │   ├─ Login with Google
    │   └─ Continue as Guest ✓
    │
[Click "Continue as Guest"]
    │
    ├─> Skip user creation
    │   (Cart stored in localStorage only)
    │
    ├─> Proceed to checkout form
    │   (Same as authenticated flow)
    │
    ├─> Fill shipping address
    │   (Not saved to account)
    │
    ├─> Complete payment
    │
    ├─> [Place Order]
    │   POST /api/v1/orders ──────────────────> ⚠️ Requires auth
    │                                                     │
    │   <────────────────────────────────────── 401 Unauthorized
    │
    ├─> Prompt: "Create account to complete order"
    │   OR "Login to continue"
    │
    └─> Force authentication
        (Guest checkout NOT supported by API)

ALTERNATIVE: If API supports guest orders
    │
    ├─> Order created with email only
    ├─> Confirmation sent to email
    └─> Order number for tracking

END
```

**API Limitation:**
- Current API requires JWT for creating orders
- Guest checkout needs temporary user creation OR API modification

**Recommendation:**
- Option 1: Create temporary user account on checkout
- Option 2: Modify API to support guest orders
- Option 3: Require login before checkout (current approach)

---

### 4. Logout

**Goal:** User signs out

```
[Click "Logout"]
    │
    ├─> POST /api/v1/auth/logout
    │   (Server-side session invalidation)
    │
    ├─> Clear client-side:
    │   - Remove token from localStorage
    │   - Clear app state
    │   - Clear cart from memory
    │
    ├─> Redirect to home page
    │
    └─> Show success toast:
        "You've been logged out"

END
```

---

## Product Discovery Flows

### 5. Search Flow

**Goal:** User finds products via search

```
┌─────────────────────────────────────────────────────────────┐
│                      SEARCH FLOW                            │
└─────────────────────────────────────────────────────────────┘

[Click search icon OR focus search input]
    │
    ├─> Input expands (mobile)
    │   OR
    ├─> Dropdown appears (desktop)
    │
[User types "lapt..."]
    │
    ├─> Debounced API call (300ms)
    │   GET /api/v1/products?search=lapt&limit=5
    │                                                     │
    │   <────────────────────────────────────── Return top 5
    │                                          matching products
    │
    ├─> Show autocomplete dropdown:
    │   ┌────────────────────────────┐
    │   │ 🔍 Search Results          │
    │   ├────────────────────────────┤
    │   │ Laptop Dell XPS 15         │
    │   │ Laptop HP Pavilion         │
    │   │ Gaming Laptop Asus ROG     │
    │   ├────────────────────────────┤
    │   │ View all results (42) →    │
    │   └────────────────────────────┘
    │
[User selects suggestion]
    │
    ├─> Navigate to product detail
    │
    OR
    │
[User presses Enter OR clicks "View all"]
    │
    ├─> Navigate to search results page
    │   /products?search=laptop
    │
    ├─> Show filtered products
    │   (Same layout as category page)
    │
    └─> Applied filters: "Search: laptop" (chip)

END
```

**Features:**
- Search in: name, description, tags, SKU
- Recent searches (stored locally)
- Clear search button
- Loading state during API call

---

### 6. Category Navigation

**Goal:** Browse products by category

```
[Click category (e.g., "Laptops")]
    │
    ├─> Navigate to /products?category=laptops
    │
    ├─> Fetch products:
    │   GET /api/v1/products?category=laptops&page=1&limit=12
    │
    ├─> Show Product List page:
    │   - Breadcrumb: Home > Electronics > Laptops
    │   - Page title: "Laptops (42 products)"
    │   - Filters sidebar (auto-filtered by category)
    │   - Product grid
    │
    └─> User can refine:
        ├─ Apply additional filters
        ├─ Sort results
        └─ Change view (grid/list)

END
```

---

### 7. Filter & Sort Flow

**Goal:** Refine product search results

```
┌─────────────────────────────────────────────────────────────┐
│                   FILTER & SORT FLOW                        │
└─────────────────────────────────────────────────────────────┘

Product List Page (initial state)
    │
    ├─> All products visible (paginated)
    │
[User applies filter: Price $500-$1000]
    │
    ├─> Update URL query params:
    │   ?category=laptops&minPrice=500&maxPrice=1000
    │
    ├─> Fetch filtered products:
    │   GET /api/v1/products?category=laptops&minPrice=500&maxPrice=1000
    │
    ├─> Update UI:
    │   - Show loading skeleton
    │   - Display filter chip: "Price: $500-$1000" [X]
    │   - Update product grid
    │   - Update count: "Laptops (18 products)"
    │
[User adds another filter: Rating 4+ stars]
    │
    ├─> Combine filters:
    │   &minPrice=500&maxPrice=1000&rating=4
    │
    ├─> Fetch & update
    │   (Count now: 12 products)
    │
[User changes sort: "Price: Low to High"]
    │
    ├─> Update URL: &sort=price
    │
    ├─> Fetch sorted results
    │
    ├─> Update grid (same filters applied)
    │
[User clicks filter chip [X]]
    │
    ├─> Remove that filter
    │   (e.g., remove &rating=4)
    │
    ├─> Fetch updated results
    │
[User clicks "Clear all filters"]
    │
    ├─> Reset to initial state:
    │   ?category=laptops only
    │
    └─> Fetch all products in category

END
```

**Mobile Variation:**
- Filters in bottom sheet/drawer
- "Filter & Sort" button with badge (count of active filters)
- Apply filters on "Apply" button click (not live)

---

## Purchase Flows

### 8. Add to Cart Flow

**Goal:** User adds product to shopping cart

```
┌─────────────────────────────────────────────────────────────┐
│                   ADD TO CART FLOW                          │
└─────────────────────────────────────────────────────────────┘

Product Detail Page
    │
[User adjusts quantity: 2]
    │
    ├─> Check stock availability
    │   (If qty > stock: disable button, show error)
    │
[Click "Add to Cart"]
    │
    ├─> Check authentication status:
    │
    │   ┌─ LOGGED IN ────────────────────────────┐
    │   │                                        │
    │   ├─> POST /api/v1/cart/items             │
    │   │   Body: { productId, quantity }       │
    │   │                                        │
    │   │   <───────────────── Cart updated     │
    │   │                      (server + DB)    │
    │   │                                        │
    │   ├─> Update UI:                          │
    │   │   - Cart badge: 🛒 (3) → 🛒 (5)      │
    │   │   - Button: "Added ✓" (2 seconds)    │
    │   │   - Show toast: "Added to cart"      │
    │   │                                        │
    │   └─> Cart persists across devices        │
    │                                             │
    │   ┌─ GUEST USER ──────────────────────────┐
    │   │                                        │
    │   ├─> Save to localStorage:               │
    │   │   cart = [{ productId, qty, price }]  │
    │   │                                        │
    │   ├─> Update UI (same as logged in)       │
    │   │                                        │
    │   └─> Cart only on this device            │
    │       (Lost if localStorage cleared)      │
    │                                             │
    └─────────────────────────────────────────────

[User clicks cart icon]
    │
    ├─> Navigate to /cart
    │
    └─> Show Shopping Cart page
        (See "Cart Management Flow")

END
```

**Edge Cases:**
- Out of stock: Disable button, show "Out of Stock" badge
- Low stock (< 5): Show "Only X left in stock"
- Product price changed: Update cart with new price
- Product deleted: Remove from cart, show notification

---

### 9. Cart Management Flow

**Goal:** Review and modify cart before checkout

```
┌─────────────────────────────────────────────────────────────┐
│                 CART MANAGEMENT FLOW                        │
└─────────────────────────────────────────────────────────────┘

Shopping Cart Page
    │
    ├─> Fetch current cart:
    │   GET /api/v1/cart (authenticated)
    │   OR
    │   Load from localStorage (guest)
    │
    ├─> Display cart items with:
    │   - Product image, name, price
    │   - Quantity selector
    │   - Remove button
    │   - Subtotal per item
    │
    ├─> Calculate totals:
    │   - Subtotal (sum of items)
    │   - Shipping (free / calculated)
    │   - Tax (if applicable)
    │   - Total
    │
[User changes quantity: 2 → 3]
    │
    ├─> LOGGED IN:
    │   PUT /api/v1/cart/items/:productId
    │   Body: { quantity: 3 }
    │
    │   └─> Update totals (real-time)
    │
    ├─> GUEST:
    │   Update localStorage
    │   Calculate new totals
    │
[User clicks remove [X]]
    │
    ├─> Show confirmation (optional):
    │   "Remove Laptop Dell XPS 15?"
    │   [Cancel] [Remove]
    │
[Confirm remove]
    │
    ├─> LOGGED IN:
    │   DELETE /api/v1/cart/items/:productId
    │
    ├─> GUEST:
    │   Remove from localStorage
    │
    ├─> Update UI:
    │   - Remove item from list
    │   - Update totals
    │   - Show toast: "Item removed" + [Undo]
    │
[Click Undo (within 5s)]
    │
    ├─> Re-add item
    │
[Cart becomes empty]
    │
    ├─> Show empty state:
    │   🛒 "Your cart is empty"
    │   [Continue Shopping] button
    │
[Click "Proceed to Checkout"]
    │
    ├─> Validate cart:
    │   - Items in stock?
    │   - Prices current?
    │
    ├─> If valid:
    │   └─> Navigate to /checkout
    │
    └─> If errors:
        - Show toast: "Some items out of stock"
        - Highlight affected items
        - Offer to remove or adjust

END
```

---

### 10. Checkout Flow (Multi-Step)

**Goal:** Complete purchase with shipping and payment info

```
┌─────────────────────────────────────────────────────────────┐
│                    CHECKOUT FLOW                            │
└─────────────────────────────────────────────────────────────┘

/checkout page
    │
    ├─> Check authentication:
    │   - Not logged in? → Redirect to login
    │   - Logged in? → Continue
    │
    ├─> Verify cart not empty:
    │   - Empty? → Redirect to /cart
    │
    ├─> Show progress: [●] Shipping → [○] Payment → [○] Review
    │
┌────────────────────────────────────────────────────────────┐
│ STEP 1: SHIPPING ADDRESS                                   │
└────────────────────────────────────────────────────────────┘
    │
    ├─> Show form:
    │   - Full Name *
    │   - Email *
    │   - Phone *
    │   - Street Address *
    │   - City, State, Zip *
    │   - Country *
    │
    ├─> For returning users:
    │   └─> Show saved addresses (if any)
    │       "Use saved address: Home / Work"
    │       OR "Add new address"
    │
[User fills form]
    │
    ├─> Client-side validation:
    │   - Required fields
    │   - Email format
    │   - Phone format
    │   - Zip code format
    │
[Click "Continue to Payment"]
    │
    ├─> Validate all fields
    │
    │   ├─ VALID:
    │   │  └─> Save to session state
    │   │      Advance to step 2
    │   │
    │   └─ INVALID:
    │      └─> Show errors
    │          Focus first error
    │
┌────────────────────────────────────────────────────────────┐
│ STEP 2: PAYMENT METHOD                                     │
└────────────────────────────────────────────────────────────┘
    │
    ├─> Progress: [✓] Shipping → [●] Payment → [○] Review
    │
    ├─> Show payment options:
    │   ○ Credit/Debit Card
    │   ○ MercadoPago
    │   ○ PayPal (if integrated)
    │
[User selects payment method]
    │
    ├─> Show method-specific form:
    │   (e.g., Credit Card: Number, Exp, CVV)
    │   OR
    │   (MercadoPago: Redirect flow)
    │
[Click "Review Order"]
    │
    ├─> Save payment method selection
    │   (Don't process payment yet)
    │
    └─> Advance to step 3
    │
┌────────────────────────────────────────────────────────────┐
│ STEP 3: REVIEW ORDER                                       │
└────────────────────────────────────────────────────────────┘
    │
    ├─> Progress: [✓] Shipping → [✓] Payment → [●] Review
    │
    ├─> Display summary:
    │   ┌──────────────────────────────────────┐
    │   │ ORDER SUMMARY                        │
    │   ├──────────────────────────────────────┤
    │   │ Items (3):                           │
    │   │  - Laptop Dell XPS 15    $1,299.99   │
    │   │  - Mouse Logitech MX3    $89.99 x2   │
    │   ├──────────────────────────────────────┤
    │   │ Shipping Address:                    │
    │   │  Juan Pérez                          │
    │   │  Av. Corrientes 1234                 │
    │   │  Buenos Aires, CABA C1043            │
    │   │  [Edit]                              │
    │   ├──────────────────────────────────────┤
    │   │ Payment Method:                      │
    │   │  💳 MercadoPago                      │
    │   │  [Edit]                              │
    │   ├──────────────────────────────────────┤
    │   │ Subtotal:        $1,479.97           │
    │   │ Shipping:        FREE                │
    │   │ Tax:             $0.00               │
    │   │ ─────────────────────────            │
    │   │ Total:           $1,479.97           │
    │   ├──────────────────────────────────────┤
    │   │ [Place Order]                        │
    │   └──────────────────────────────────────┘
    │
[Click "Place Order"]
    │
    ├─> Show loading state:
    │   "Processing your order..."
    │   (Disable button to prevent double-click)
    │
    ├─> Submit order:
    │   POST /api/v1/orders
    │   Body: {
    │     shippingAddress: { ... },
    │     paymentMethod: "mercadopago",
    │     notes: ""
    │   }
    │
    ├─> API processes (within transaction):
    │   1. Validate cart items
    │   2. Check stock availability
    │   3. Create order
    │   4. Reduce product stock
    │   5. Clear user's cart
    │   6. Send confirmation email (async)
    │
    │   ┌─ SUCCESS (201 Created) ────────────────┐
    │   │                                        │
    │   │ Response: {                            │
    │   │   orderNumber: "ORD-20251113-00042",  │
    │   │   total: 1479.97,                     │
    │   │   status: "pending"                   │
    │   │ }                                      │
    │   │                                        │
    │   ├─> Navigate to:                        │
    │   │   /order-confirmation/:orderNumber    │
    │   │                                        │
    │   └─> Show confirmation page (next flow)  │
    │                                             │
    │   ┌─ ERROR (400 / 500) ────────────────────┐
    │   │                                        │
    │   │ Examples:                              │
    │   │ - "Stock insuficiente para X"         │
    │   │ - "Carrito vacío"                     │
    │   │ - "Error de validación"               │
    │   │                                        │
    │   ├─> Show error toast/modal              │
    │   │                                        │
    │   ├─> If stock issue:                     │
    │   │   - Redirect to cart                  │
    │   │   - Highlight affected items          │
    │   │                                        │
    │   └─> If other error:                     │
    │       - Show retry button                 │
    │       - Offer support contact             │
    │                                             │
    └─────────────────────────────────────────────

END → Order Confirmation Flow
```

**Security Notes:**
- Never store card details on frontend
- Use HTTPS for all checkout pages
- Display security badges (SSL, payment logos)
- Implement CSRF protection

---

### 11. Order Confirmation Flow

**Goal:** Confirm order and provide next steps

```
┌─────────────────────────────────────────────────────────────┐
│                ORDER CONFIRMATION FLOW                      │
└─────────────────────────────────────────────────────────────┘

/order-confirmation/:orderNumber
    │
    ├─> Fetch order details:
    │   GET /api/v1/orders/:orderNumber
    │
    ├─> Show success page:
    │   ┌──────────────────────────────────────┐
    │   │      ✓ Order Confirmed!              │
    │   │                                       │
    │   │  Order #ORD-20251113-00042            │
    │   │  Total: $1,479.97                     │
    │   │                                       │
    │   │  We've sent a confirmation to:        │
    │   │  juan@example.com                     │
    │   ├───────────────────────────────────────┤
    │   │  What's Next?                         │
    │   │  ✉️  Check your email for details     │
    │   │  📦 We'll ship within 1-2 days        │
    │   │  🚚 Estimated delivery: 5-7 days      │
    │   ├───────────────────────────────────────┤
    │   │  [Track Order]  [Continue Shopping]   │
    │   └───────────────────────────────────────┘
    │
    ├─> Trigger analytics:
    │   - Conversion event
    │   - Order value
    │   - Product IDs
    │
    ├─> Clear cart:
    │   - Already done by API
    │   - Clear localStorage (guest)
    │   - Update cart badge: 🛒 (0)
    │
[User clicks "Track Order"]
    │
    └─> Navigate to /orders/:orderNumber
        (Order Detail page)

OR

[User clicks "Continue Shopping"]
    │
    └─> Navigate to home page

END
```

---

## Account Management Flows

### 12. View Order History

**Goal:** User reviews past orders

```
/orders page (requires auth)
    │
    ├─> Fetch user's orders:
    │   GET /api/v1/orders?page=1&limit=10
    │
    ├─> Display orders table/list:
    │   ┌────────────────────────────────────────┐
    │   │ Order #      Date    Total    Status   │
    │   ├────────────────────────────────────────┤
    │   │ ORD-00042    Nov 13  $1,479  [Shipped] │
    │   │ ORD-00039    Nov 10  $89.99  [Deliver] │
    │   │ ORD-00031    Oct 28  $450    [Pending] │
    │   └────────────────────────────────────────┘
    │
[Click order row]
    │
    └─> Navigate to /orders/:orderNumber
        (Order Detail page)

ORDER DETAIL PAGE
    │
    ├─> Fetch order:
    │   GET /api/v1/orders/:id
    │
    ├─> Display:
    │   - Order number, date, status
    │   - Items ordered (images, names, prices)
    │   - Shipping address
    │   - Payment method
    │   - Order timeline:
    │     ✓ Ordered (Nov 13, 10:30 AM)
    │     ✓ Processing (Nov 13, 11:00 AM)
    │     ✓ Shipped (Nov 14, 9:00 AM) → Tracking: TRACK123
    │     ○ Delivered (Expected: Nov 18)
    │
[Click "Track Shipment"]
    │
    ├─> Open tracking URL (external)
    │   (If integrated with shipping provider)
    │
[Click "Cancel Order" (if allowed)]
    │
    ├─> Show confirmation modal:
    │   "Are you sure you want to cancel?"
    │   [No] [Yes, Cancel Order]
    │
[Confirm cancellation]
    │
    ├─> PUT /api/v1/orders/:id/cancel
    │
    │   ┌─ SUCCESS ──────────────────────────┐
    │   │                                    │
    │   │ - Order status: "cancelled"       │
    │   │ - Stock restored                  │
    │   │ - Refund initiated (if paid)      │
    │   │                                    │
    │   └─> Show success message            │
    │       Update order status on page     │
    │                                         │
    │   ┌─ ERROR ────────────────────────────┐
    │   │                                    │
    │   │ "Cannot cancel: already shipped"  │
    │   │                                    │
    │   └─> Show error toast                │
    │                                         │
    └─────────────────────────────────────────

END
```

**Cancellation Rules (API):**
- Can cancel if status: pending, processing
- Cannot cancel if: shipped, delivered, already cancelled

---

## Error Handling & Edge Cases

### 13. Network Errors

**Scenario:** API request fails (timeout, 500 error, no connection)

```
[User action triggers API call]
    │
    ├─> Request sent
    │
    │   ⚠️ Network error / Timeout
    │
    ├─> Show error toast:
    │   "Connection error. Please try again."
    │   [Retry]
    │
[Click Retry]
    │
    └─> Retry same request (max 3 attempts)
        │
        ├─ SUCCESS: Continue flow
        │
        └─ STILL FAILING:
           Show more detailed error:
           "Unable to connect. Check your internet."
           [Contact Support]

ALTERNATIVE: Offline Mode
    │
    ├─> Detect offline state:
    │   window.addEventListener('offline', ...)
    │
    ├─> Show banner:
    │   "You're offline. Some features unavailable."
    │
    └─> Queue actions (e.g., add to cart)
        Sync when back online
```

---

### 14. Stock Unavailable (During Checkout)

**Scenario:** Product goes out of stock between add-to-cart and checkout

```
[User at checkout, clicks "Place Order"]
    │
    ├─> POST /api/v1/orders
    │
    │   ⚠️ 400 Bad Request
    │   "Stock insuficiente para Laptop Dell XPS 15"
    │
    ├─> Show error modal:
    │   ┌────────────────────────────────────┐
    │   │ ⚠️ Stock Issue                     │
    │   │                                    │
    │   │ Sorry, "Laptop Dell XPS 15" is    │
    │   │ no longer available in the        │
    │   │ quantity you requested.           │
    │   │                                    │
    │   │ Available: 0                      │
    │   │ In your cart: 1                   │
    │   │                                    │
    │   │ [Remove from Cart] [Go to Cart]   │
    │   └────────────────────────────────────┘
    │
[Click "Go to Cart"]
    │
    ├─> Navigate to /cart
    │
    ├─> Highlight affected item:
    │   (Red border, "Out of Stock" badge)
    │
    └─> User must remove or adjust quantity

END (Cannot proceed until cart valid)
```

---

### 15. Session Expiration

**Scenario:** JWT token expires during session

```
[User logged in, browsing]
    │
    ├─> Token expires (7 days default)
    │
[User tries protected action: "View Orders"]
    │
    ├─> GET /api/v1/orders
    │
    │   ⚠️ 401 Unauthorized
    │   "Token inválido o expirado"
    │
    ├─> Detect 401 response (global interceptor)
    │
    ├─> Clear auth state:
    │   - Remove token
    │   - Clear user data
    │
    ├─> Show modal:
    │   "Your session expired. Please log in again."
    │   [Login]
    │
    ├─> Redirect to login
    │   (Save intended destination)
    │
[User logs in again]
    │
    └─> Redirect to original destination
        (e.g., /orders)

END
```

---

### 16. Empty States

**Scenario:** User encounters empty data

**Empty Cart:**
```
/cart (no items)
    │
    └─> Show empty state:
        ┌────────────────────────────┐
        │       🛒                   │
        │  Your cart is empty        │
        │                            │
        │  [Continue Shopping]       │
        └────────────────────────────┘
```

**No Search Results:**
```
Search: "xyz123" (0 results)
    │
    └─> Show empty state:
        ┌────────────────────────────┐
        │      🔍                    │
        │  No results for "xyz123"   │
        │                            │
        │  Suggestions:              │
        │  - Check spelling          │
        │  - Try different keywords  │
        │  - Browse categories       │
        │                            │
        │  [Browse Products]         │
        └────────────────────────────┘
```

**No Orders:**
```
/orders (first-time user)
    │
    └─> Show empty state:
        ┌────────────────────────────┐
        │      📦                    │
        │  No orders yet             │
        │                            │
        │  [Start Shopping]          │
        └────────────────────────────┘
```

---

### 17. Form Validation Errors

**Scenario:** User submits form with invalid data

```
[User fills checkout form, clicks submit]
    │
    ├─> Client-side validation:
    │
    │   ⚠️ Errors found:
    │   - Email: "Invalid email format"
    │   - Phone: "Required field"
    │   - Zip: "Must be 5 digits"
    │
    ├─> Prevent form submission
    │
    ├─> Show errors:
    │   - Red border on invalid fields
    │   - Error message below each field
    │   - Error summary at top (optional)
    │
    ├─> Focus first error field
    │
    └─> Announce errors to screen reader:
        "3 errors found. Please fix and resubmit."

[User corrects errors, resubmits]
    │
    ├─> Client validation passes
    │
    ├─> Submit to API
    │
    │   ⚠️ Server-side validation error
    │   (e.g., "This email is already registered")
    │
    ├─> Show server error:
    │   (Same UI as client-side errors)
    │
    └─> User corrects and resubmits

END (Form submitted successfully)
```

---

## Flow Diagrams Summary

### Key User Journeys

1. **Guest Browsing → Purchase**
   - Home → Search/Category → Product Detail → Cart → Login → Checkout → Confirmation

2. **Returning User Purchase**
   - Home → Search → Product → Add to Cart (1-click, logged in) → Checkout (saved address) → Done

3. **Authentication**
   - Any page → Click Login → Google OAuth → Return to page (authenticated)

4. **Post-Purchase**
   - Confirmation → Email → Track Order → My Orders → Order Detail

---

## Performance Considerations

### Critical User Paths
- **Time to First Product:** < 2 seconds
- **Add to Cart:** Instant feedback (< 100ms)
- **Checkout → Confirmation:** < 30 seconds

### Loading States
- Show skeleton loaders for async content
- Disable buttons during submission
- Progress indicators for multi-step flows

### Error Recovery
- Auto-retry transient errors (network)
- Preserve user input on validation errors
- Offer clear next steps on failures

---

## Mobile-Specific Flows

### Mobile Considerations

**Navigation:**
- Hamburger menu for categories
- Bottom nav bar (optional: Home, Search, Cart, Account)
- Swipe gestures (back, drawer)

**Search:**
- Full-screen search overlay
- Sticky search bar on results

**Filters:**
- Bottom sheet (slide up from bottom)
- Apply button (not live filtering)

**Checkout:**
- Sticky "Place Order" button
- Collapsed sections (expandable)

**Cart:**
- Swipe to delete items
- Sticky checkout bar

---

## Analytics & Tracking

### Events to Track

**E-commerce:**
- Product viewed (productId, name, price)
- Add to cart (productId, quantity)
- Remove from cart
- Checkout started
- Checkout step completed (1, 2, 3)
- Purchase completed (orderNumber, total, items)

**Navigation:**
- Search performed (query, resultsCount)
- Category clicked
- Filter applied (filterType, value)
- Sort changed

**User:**
- Login/Logout
- Account created
- Order viewed

---

## Next Steps

1. **Validate flows with stakeholders**
2. **Create wireframes for each screen** (see wireframes section below)
3. **Identify API gaps** (e.g., guest checkout support)
4. **Plan error messaging copy**
5. **Design loading states**

---

## Wireframes Preview

The following wireframes are described textually. For visual wireframes, see the wireframes section below.

### Home Page
- Hero banner (full-width)
- Featured categories (4-column grid)
- Featured products (4-column grid, 8 products)
- Promotional banner
- Footer

### Product List
- Header with breadcrumb
- Filters sidebar (left, 25%)
- Product grid (right, 75%, responsive)
- Pagination

### Product Detail
- Image gallery (left, 50%)
- Product info (right, 50%)
- Tabs below (Description, Specs, Reviews)
- Related products carousel

### Cart
- Cart items list (left, 60%)
- Order summary (right, 40%, sticky)

### Checkout
- Progress stepper (top)
- Form (left, 60%)
- Order summary (right, 40%, sticky)

---

**Maintained by:** UX/UI Design Team
**Reference:** Design System (`design-system.md`), Components (`components-spec.md`)
