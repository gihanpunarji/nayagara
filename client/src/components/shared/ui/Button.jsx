import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-primary text-white hover:shadow-green-lg focus:ring-primary-500 active:scale-[0.98]',
    secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:shadow-lg focus:ring-secondary-500 active:scale-[0.98]',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg focus:ring-red-500 active:scale-[0.98]',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg focus:ring-green-500 active:scale-[0.98]',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-lg focus:ring-yellow-500 active:scale-[0.98]',
    dark: 'bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:shadow-lg focus:ring-gray-500 active:scale-[0.98]'
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const renderIcon = () => {
    if (loading) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }
    return icon;
  };

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {iconPosition === 'left' && renderIcon() && (
        <span className={children ? 'mr-2' : ''}>{renderIcon()}</span>
      )}
      {children}
      {iconPosition === 'right' && renderIcon() && (
        <span className={children ? 'ml-2' : ''}>{renderIcon()}</span>
      )}
    </button>
  );
};

export default Button;