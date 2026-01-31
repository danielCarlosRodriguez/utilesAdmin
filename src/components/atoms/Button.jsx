import { forwardRef } from 'react';

/**
 * Button Component - Atomic Design Pattern
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} props.variant - Button variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {boolean} props.fullWidth - Make button full width
 * @param {boolean} props.disabled - Disable button
 * @param {boolean} props.loading - Show loading state
 * @param {React.ReactNode} props.leftIcon - Icon on the left
 * @param {React.ReactNode} props.rightIcon - Icon on the right
 * @param {React.ReactNode} props.children - Button content
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * @example
 * <Button variant="outline" leftIcon={<CartIcon />} loading={isLoading}>
 *   Add to cart
 * </Button>
 */
const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  type = 'button',
  ...props
}, ref) => {

  // Base styles (siempre aplicados)
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
  `;

  // Variant styles
  const variants = {
    primary: `
      bg-primary-500 text-white
      hover:bg-primary-600 active:bg-primary-700
      focus-visible:ring-primary-500
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-secondary-500 text-white
      hover:bg-secondary-600 active:bg-secondary-700
      focus-visible:ring-secondary-500
      shadow-sm hover:shadow-md
    `,
    outline: `
      border-2 border-primary-500 text-primary-600
      hover:bg-primary-50 active:bg-primary-100
      focus-visible:ring-primary-500
    `,
    ghost: `
      text-neutral-700 bg-transparent
      hover:bg-neutral-100 active:bg-neutral-200
      focus-visible:ring-neutral-400
    `,
    danger: `
      bg-error-500 text-white
      hover:bg-error-600 active:bg-error-700
      focus-visible:ring-error-500
      shadow-sm hover:shadow-md
    `,
  };

  // Size styles (reducidos)
  const sizes = {
    sm: 'px-2.5 py-1 text-xs gap-1',
    md: 'px-3.5 py-1.5 text-sm gap-1.5',
    lg: 'px-5 py-2 text-base gap-2',
  };

  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';

  // Combine all styles
  const buttonClasses = `
    ${baseStyles}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${widthStyle}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={buttonClasses}
      aria-busy={loading}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Left icon */}
      {!loading && leftIcon && (
        <span className="shrink-0" aria-hidden="true">
          {leftIcon}
        </span>
      )}

      {/* Button content */}
      <span>{children}</span>

      {/* Right icon */}
      {!loading && rightIcon && (
        <span className="shrink-0" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
