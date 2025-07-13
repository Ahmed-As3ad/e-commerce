import React from 'react';

const ActionButton = ({ 
  onClick, 
  loading = false, 
  disabled = false, 
  variant = 'primary', 
  size = 'md',
  icon,
  children,
  className = "",
  ariaLabel,
  fullWidth = false,
  ...props 
}) => {
  const baseClasses = "font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl focus:ring-indigo-500",
    secondary: "border-2 border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600 bg-white focus:ring-indigo-500",
    wishlist: "border-2 border-red-400 text-red-600 bg-red-50 hover:bg-red-100 focus:ring-red-500",
    wishlistEmpty: "border-2 border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-600 bg-white focus:ring-red-500",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-md focus:ring-red-500"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const widthClass = fullWidth ? "w-full" : "";
  const loadingClass = loading || disabled ? "opacity-75 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${loadingClass} ${className}`}
      onClick={onClick}
      disabled={loading || disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && <i className={`${icon} mr-2`} />}
          {children}
        </>
      )}
    </button>
  );
};

export default ActionButton;
