# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ÚtilesYa is a school supplies e-commerce storefront built with React 19, TypeScript, and Vite. It displays products from a JSON data file with category filtering, search, price filtering, sorting, shopping cart, and WhatsApp ordering.

## Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (port 5173)
- `npm run build` - Production build (outputs to `dist/`)
- `npm run preview` - Preview production build

## Architecture

### Tech Stack
- React 19 with TypeScript
- Vite for bundling
- React Router DOM for client-side routing
- Tailwind CSS via CDN (configured in `index.html`)
- Material Symbols icons + Bootstrap Icons
- Google Analytics (gtag.js)

### Routing Structure
- `/` - HomePage with product grid, category filters, price filter, sorting, and search
- `/product/:refid` - ProductDetail page with image gallery
- `/cart` - CartPage for reviewing items
- `/checkout` - CheckoutPage for order summary before WhatsApp

### State Management

**Cart Context** (`src/context/CartContext.tsx`):
- `useCart()` hook: `items`, `addItem`, `updateItem`, `removeItem`, `clear`
- LocalStorage persistence (key: `utiles-cart`)
- Reducer pattern for state updates

**Toast Context** (`src/context/ToastContext.tsx`):
- `useToast()` hook: `showToast(message, type)`
- Types: `success`, `error`, `info`
- Auto-dismiss after 3 seconds

### Services Layer

`src/services/products.ts` abstracts data fetching:
- `getProducts()` - All active products
- `getProduct(id)` - Single product by ID
- `getProductsByCategory(category)` - Filtered by category
- `getCategories()` - Unique categories
- `searchProducts(term)` - Text search
- `getPriceRange()` - Min/max prices for filters

### Data Flow
Products are fetched from `/data/productos.json` (located in `public/data/`). The JSON uses Spanish field names:
- `refid` - Product ID
- `descripción` - Title
- `categoría` - Category
- `precio` - Price
- `imagen` - Array of image filenames
- `marca` - Brand
- `detalle` - Description
- `stock` - Available quantity
- `sku` - SKU (same as refid)
- `activo` - Whether product is active
- `destacado` - Featured flag
- `descuento` - Discount (null if none)
- `tags` - Array of tags

Product images are stored in `/public/imagenes/productos/`.

### Key Components

**Pages:**
- `HomePage.tsx` - Product listing with filters (category, price range), sorting, search feedback
- `ProductDetail.tsx` - Product view with image gallery and add-to-cart
- `CartPage.tsx` - Cart review with continue to checkout
- `CheckoutPage.tsx` - Order summary with customer name/note, WhatsApp sending

**UI Components:**
- `Cards.jsx` - Product card with cart integration, toast notifications, pastel variants
- `MiniCart.tsx` - Slide-out cart drawer
- `Header.tsx` - Navigation with search input and cart badge
- `Footer.tsx` - WhatsApp contact links
- `ProductSkeleton.tsx` - Loading placeholder for products
- `EmptyState.tsx` - Reusable empty state with icon, title, description, CTA
- `ToastContainer.tsx` - Toast notifications display

### WhatsApp Integration
Orders and sharing use WhatsApp deep links (`https://wa.me/`). Business number: `59897098751`.

### Styling
Tailwind config is defined inline in `index.html` with custom colors:
- `primary` - #2b8cee (blue)
- `pastel-mint`, `pastel-lavender`, `pastel-yellow`, `pastel-pink`, `pastel-blue`
- Category chip classes: `pastel-chip-1` through `pastel-chip-10`, `pastel-chip-active`

CSS includes `prefers-reduced-motion` support for accessibility.

### Deployment
Configured for Netlify deployment (`netlify.toml`). SPA redirects are configured for React Router.

## Future Backend Integration

The services layer (`src/services/products.ts`) is designed for easy backend migration:
- Set `VITE_API_URL` environment variable to point to your API
- Product interface includes fields for stock management, discounts, and featured products
- Cart structure ready for user authentication integration
