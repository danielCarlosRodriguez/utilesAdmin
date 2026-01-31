import { forwardRef, useState } from 'react';

/**
 * Input Component - Atomic Design Pattern
 *
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.type - Input type (text, email, password, number, etc.)
 * @param {string} props.error - Error message
 * @param {string} props.helperText - Helper text below input
 * @param {boolean} props.disabled - Disable input
 * @param {boolean} props.required - Mark as required
 * @param {boolean} props.fullWidth - Make input full width
 * @param {React.ReactNode} props.leftIcon - Icon on the left
 * @param {React.ReactNode} props.rightIcon - Icon on the right
 * @param {'sm'|'md'|'lg'} props.size - Input size
 *
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="john@example.com"
 *   error={errors.email}
 *   required
 * />
 *
 * @example
 * <Input
 *   type="search"
 *   placeholder="Search products..."
 *   leftIcon={<SearchIcon />}
 * />
 */
const Input = forwardRef(({
  label,
  placeholder,
  type = 'text',
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  size = 'md',
  className = '',
  id,
  name,
  ...props
}, ref) => {

  const [showPassword, setShowPassword] = useState(false);

  // Generate unique ID if not provided
  const inputId = id || `input-${name || Math.random().toString(36).substr(2, 9)}`;

  // Size styles (reducidos)
  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  // Base input styles
  const baseStyles = `
    w-full rounded-lg border
    bg-white dark:bg-neutral-900
    transition-all duration-200
    placeholder:text-neutral-400 dark:placeholder:text-neutral-500
    disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-0
  `;

  // State-based styles
  const stateStyles = error
    ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20 text-error-900 dark:text-error-400'
    : 'border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500/20 text-neutral-900 dark:text-neutral-100';

  // Icon padding adjustments
  const iconPadding = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';

  // Combine input classes
  const inputClasses = `
    ${baseStyles}
    ${stateStyles}
    ${sizes[size] || sizes.md}
    ${iconPadding}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // Wrapper width
  const wrapperWidth = fullWidth ? 'w-full' : '';

  // Password toggle for password inputs
  const isPasswordInput = type === 'password';
  const actualType = isPasswordInput && showPassword ? 'text' : type;

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperWidth}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
          {required && <span className="text-error-500 ml-1" aria-label="required">*</span>}
        </label>
      )}

      {/* Input wrapper for icons */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            {leftIcon}
          </div>
        )}

        {/* Input field */}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={actualType}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={inputClasses}
          {...props}
        />

        {/* Right icon or password toggle */}
        {(rightIcon || isPasswordInput) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isPasswordInput ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? (
                  // Eye slash icon
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  // Eye icon
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            ) : (
              <div className="text-neutral-400">
                {rightIcon}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-error-500 flex items-center gap-1"
          role="alert"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {/* Helper text */}
      {!error && helperText && (
        <p
          id={`${inputId}-helper`}
          className="text-sm text-neutral-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
