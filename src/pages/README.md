# Pages

This directory contains page components for route definitions.

## Planned Pages

- `Home.jsx` - Landing page with featured products
- `ProductList.jsx` - Product catalog with filters
- `ProductDetail.jsx` - Single product view
- `Cart.jsx` - Shopping cart page
- `Checkout.jsx` - Checkout flow
- `Orders.jsx` - Order history
- `OrderDetail.jsx` - Single order view
- `Profile.jsx` - User profile
- `Login.jsx` - Login/authentication
- `NotFound.jsx` - 404 page

## Page Structure

Each page should:
1. Use templates from `components/templates`
2. Fetch data using custom hooks
3. Handle loading and error states
4. Include SEO meta tags
5. Be lazy loaded for performance

## Example Page

```jsx
/**
 * ProductList Page
 * Displays all products with filtering
 */
import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/templates';
import { ProductGrid } from '@/components/organisms';
import { useProducts } from '@/hooks/useProducts';

const ProductList = () => {
  const { products, loading, error, filters, setFilters } = useProducts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <PageLayout title="Products">
      <ProductGrid products={products} />
    </PageLayout>
  );
};

export default ProductList;
```
