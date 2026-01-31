/**
 * Badge Component - Atomic Design Pattern
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'success'|'warning'|'error'|'neutral'} props.variant - Badge color variant
 * @param {'sm'|'md'|'lg'} props.size - Badge size
 * @param {boolean} props.dot - Show dot indicator
 * @param {boolean} props.removable - Show remove button
 * @param {Function} props.onRemove - Remove button callback
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {React.ReactNode} props.children - Badge content
 *
 * @example
 * <Badge variant="success">In Stock</Badge>
 *
 * @example
 * <Badge variant="error" size="sm" dot>
 *   Out of Stock
 * </Badge>
 *
 * @example
 * <Badge variant="primary" removable onRemove={handleRemove}>
 *   Electronics
 * </Badge>
 */
const Badge = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  icon,
  children,
  className = '',
  ...props
}) => {

  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-colors duration-200
  `;

  // Variant styles
  const variants = {
    primary: 'bg-primary-100 text-primary-700 border-2 border-primary-500 dark:bg-primary-900/40 dark:text-primary-200 dark:border-primary-500',
    secondary: 'bg-secondary-100 text-secondary-700 border-2 border-secondary-400 dark:bg-secondary-900/30 dark:text-secondary-300 dark:border-secondary-600',
    success: 'bg-green-100 text-green-800 border-2 border-green-500 dark:bg-green-900/40 dark:text-green-200 dark:border-green-500',
    warning: 'bg-amber-100 text-amber-800 border-2 border-amber-500 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-500',
    error: 'bg-red-100 text-red-800 border-2 border-red-500 dark:bg-red-900/40 dark:text-red-200 dark:border-red-500',
    info: 'bg-indigo-100 text-indigo-800 border-2 border-indigo-500 dark:bg-indigo-900/40 dark:text-indigo-200 dark:border-indigo-500',
    neutral: 'bg-neutral-100 text-neutral-700 border-2 border-neutral-400 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-500',
  };

  // Size styles
  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2',
  };

  // Dot size
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  // Icon size
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Combine all styles
  const badgeClasses = `
    ${baseStyles}
    ${variants[variant] || variants.neutral}
    ${sizes[size] || sizes.md}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // Dot color based on variant
  const dotColors = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    info: 'bg-indigo-500',
    neutral: 'bg-neutral-500',
  };

  return (
    <span className={badgeClasses} {...props}>
      {/* Dot indicator */}
      {dot && (
        <span
          className={`rounded-full ${dotSizes[size]} ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}

      {/* Icon */}
      {icon && (
        <span className={`shrink-0 ${iconSizes[size]}`} aria-hidden="true">
          {icon}
        </span>
      )}

      {/* Content */}
      {children && <span>{children}</span>}

      {/* Remove button */}
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 ml-1 rounded-full hover:bg-black/10 transition-colors p-0.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current"
          aria-label="Remove"
        >
          <svg
            className={iconSizes[size]}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge;
