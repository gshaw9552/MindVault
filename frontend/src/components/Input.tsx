import React from "react";

interface InputProps {
  placeholder: string;
  type?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    placeholder, 
    type = "text", 
    inputRef, 
    onKeyDown,
    disabled = false,
    error,
    label,
    required = false,
    autoComplete,
    className = "",
    ...props 
  }, ref) => {
    // Use the passed ref or the inputRef prop
    const inputReference = inputRef || ref;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={inputReference}
          placeholder={placeholder}
          type={type}
          onKeyDown={onKeyDown}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={`
            w-full px-4 py-3 
            border border-gray-300 rounded-lg
            bg-white
            text-gray-900 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            hover:border-gray-400
            transition-colors duration-200
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? 'border-red-300 focus:ring-red-500' : ''}
            ${className}
          `.trim()}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";