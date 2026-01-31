# Components Directory

This directory follows the **Atomic Design Pattern** for component organization.

## Structure

```
components/
├── atoms/        # Basic building blocks (Button, Input, Badge, etc)
├── molecules/    # Simple component combinations (SearchBar, ProductCard)
├── organisms/    # Complex component combinations (Header, Footer, ProductGrid)
└── templates/    # Page layouts and templates
```

## Atomic Design Principles

### Atoms
- **Definition**: Basic building blocks that can't be broken down further
- **Examples**: Button, Input, Badge, Icon, Typography
- **Rules**:
  - No dependencies on other components
  - Highly reusable
  - Accept props for customization
  - Include accessibility attributes

### Molecules
- **Definition**: Simple groups of atoms working together
- **Examples**: SearchBar (Input + Button), ProductCard (Card + Image + Button)
- **Rules**:
  - Composed of atoms
  - Still relatively simple
  - Single responsibility

### Organisms
- **Definition**: Complex components composed of molecules and atoms
- **Examples**: Header (Logo + Navigation + SearchBar), ProductGrid (multiple ProductCards)
- **Rules**:
  - Can be complex
  - May have business logic
  - Often connected to state management

### Templates
- **Definition**: Page-level layouts that define structure
- **Examples**: PageLayout (Header + Content + Footer), CheckoutLayout
- **Rules**:
  - Define page structure
  - No specific content
  - Reusable across pages

## Component Guidelines

### 1. Naming Conventions
- Use PascalCase for component names
- Use descriptive names (ProductCard, not PC)
- Export as default when single export

### 2. Props
- Use prop-types or TypeScript for validation
- Provide sensible defaults
- Document props in JSDoc comments

### 3. Accessibility
- Always include ARIA labels
- Ensure keyboard navigation
- Maintain proper semantic HTML
- Test with screen readers

### 4. Styling
- Use Tailwind CSS classes
- Reference CSS variables from theme.css
- Keep components responsive (mobile-first)
- Avoid hardcoded colors

### 5. Performance
- Use React.memo for expensive renders
- Lazy load heavy components
- Optimize images (use lazy loading)
- Keep bundle size small

## Example Component

```jsx
/**
 * ProductCard Component
 *
 * @param {Object} props
 * @param {Object} props.product - Product data
 * @param {Function} props.onAddToCart - Add to cart handler
 */
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Card hoverable>
      <CardImage src={product.image} alt={product.name} />
      <CardBody>
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-neutral-600">${product.price}</p>
        <Button onClick={() => onAddToCart(product)}>
          Add to Cart
        </Button>
      </CardBody>
    </Card>
  );
};

export default ProductCard;
```

## Usage

```jsx
import { Button, Input, Badge } from '@/components/atoms';
import { SearchBar, ProductCard } from '@/components/molecules';
import { Header, ProductGrid } from '@/components/organisms';
```
