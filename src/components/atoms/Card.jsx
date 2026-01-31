/**
 * Card Component - Atomic Design Pattern
 *
 * @param {Object} props
 * @param {'flat'|'elevated'|'outlined'} props.variant - Card style variant
 * @param {boolean} props.hoverable - Add hover effect
 * @param {boolean} props.clickable - Add clickable styles
 * @param {'none'|'sm'|'md'|'lg'|'xl'} props.padding - Card padding
 * @param {React.ReactNode} props.children - Card content
 * @param {Function} props.onClick - Click handler
 *
 * @example
 * <Card variant="elevated" padding="md">
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 *
 * @example
 * <Card variant="outlined" hoverable clickable onClick={handleClick}>
 *   Clickable card with hover effect
 * </Card>
 */
const Card = ({
  variant = 'elevated',
  hoverable = false,
  clickable = false,
  padding = 'md',
  children,
  className = '',
  onClick,
  ...props
}) => {

  // Base styles
  const baseStyles = `
    bg-white dark:bg-neutral-800 rounded-xl
    transition-all duration-200
  `;

  // Variant styles
  const variants = {
    flat: 'shadow-none',
    elevated: 'shadow-md hover:shadow-lg',
    outlined: 'border-2 border-neutral-200 dark:border-neutral-700 shadow-none',
  };

  // Padding styles
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  // Hoverable styles
  const hoverStyles = hoverable
    ? 'hover:-translate-y-1 hover:shadow-xl'
    : '';

  // Clickable styles
  const clickableStyles = clickable
    ? 'cursor-pointer active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
    : '';

  // Combine all styles
  const cardClasses = `
    ${baseStyles}
    ${variants[variant] || variants.elevated}
    ${paddings[padding] || paddings.md}
    ${hoverStyles}
    ${clickableStyles}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // Render as button if clickable and has onClick
  const Component = clickable && onClick ? 'button' : 'div';

  return (
    <Component
      className={cardClasses}
      onClick={onClick}
      type={Component === 'button' ? 'button' : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * CardHeader - Subcomponent for card header
 */
export const CardHeader = ({ children, className = '', ...props }) => (
  <div
    className={`border-b border-neutral-200 dark:border-neutral-700 pb-3 mb-3 ${className}`}
    {...props}
  >
    {children}
  </div>
);

/**
 * CardBody - Subcomponent for card body
 */
export const CardBody = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

/**
 * CardFooter - Subcomponent for card footer
 */
export const CardFooter = ({ children, className = '', ...props }) => (
  <div
    className={`border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-3 ${className}`}
    {...props}
  >
    {children}
  </div>
);

/**
 * CardImage - Subcomponent for card image
 */
export const CardImage = ({ src, alt, className = '', aspectRatio = 'auto', ...props }) => {
  const aspectRatios = {
    auto: 'aspect-auto',
    square: 'aspect-square',
    video: 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/4': 'aspect-[3/4]',
    '16/9': 'aspect-video',
  };

  return (
    <div className={`overflow-hidden rounded-t-xl ${aspectRatios[aspectRatio] || aspectRatios.auto}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default Card;
