import React from "react";

interface InputProps {
  placeholder: string;
  type?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, type = "text", inputRef }, _ref) => {
    return (
      <div className="w-full">
        <input
          ref={inputRef}
          placeholder={placeholder}
          type={type}
          className="px-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>
    );
  }
);

Input.displayName = "Input";
