# Utility Functions

This directory contains reusable utility functions and helpers.

## Planned Utilities

### formatters.js
- `formatPrice(price, currency)` - Format price with currency
- `formatDate(date, format)` - Format dates
- `formatNumber(number)` - Format numbers with separators
- `truncateText(text, maxLength)` - Truncate long text

### validators.js
- `validateEmail(email)` - Email validation
- `validatePhone(phone)` - Phone validation
- `validatePassword(password)` - Password strength validation
- `validateCreditCard(number)` - Credit card validation

### helpers.js
- `debounce(fn, delay)` - Debounce function
- `throttle(fn, delay)` - Throttle function
- `classNames(...classes)` - Combine class names
- `slugify(text)` - Convert text to slug

### constants.js
- API endpoints
- Error messages
- Regex patterns
- Configuration values

## Example Utility

```js
/**
 * Format price with currency symbol
 * @param {number} price - Price value
 * @param {string} currency - Currency code (USD, EUR, etc)
 * @returns {string} Formatted price
 */
export const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Combine class names conditionally
 * @param {...string|Object} classes - Class names or objects
 * @returns {string} Combined class names
 */
export const classNames = (...classes) => {
  return classes
    .flat()
    .filter((x) => typeof x === 'string')
    .join(' ')
    .trim();
};
```

## Usage

```jsx
import { formatPrice, validateEmail, classNames } from '@/utils';

// Format price
const price = formatPrice(29.99, 'USD'); // "$29.99"

// Validate email
const isValid = validateEmail('user@example.com'); // true

// Combine classes
const className = classNames(
  'base-class',
  isActive && 'active',
  'another-class'
); // "base-class active another-class"
```
