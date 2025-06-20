import { ReactElement } from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  variant: "primary" | "secondary" | "danger" | "outline" | "ghost" | "solid" | "normal";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const variantClasses: Record<ButtonProps["variant"], string> = {
  primary: "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800",
  secondary: "bg-purple-200 text-purple-600 hover:bg-purple-300",
  danger: "bg-red-500 text-white hover:bg-red-600",
  outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
  ghost: "text-purple-600 hover:bg-purple-50 hover:text-purple-700 border border-purple-600",
  solid: "bg-purple-500 text-white hover:bg-purple-600",
  normal: "text-purple-600 hover:text-purple-700 font-medium hover:underline focus:outline-none focus:underline",
};

const defaultStyles = "font-medium px-4 py-2 rounded-md font-light flex items-center transition-colors duration-200";

export function Button(props: ButtonProps) {
  const {
    type = "button",
    variant,
    text,
    startIcon,
    endIcon,
    onClick,
    fullWidth,
    loading,
    disabled,
  } = props;

  const isDisabled = loading || disabled;

  const classes = [
    variantClasses[variant],
    defaultStyles,
    fullWidth ? "w-full justify-center" : "",
    isDisabled ? "opacity-50 cursor-not-allowed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={isDisabled}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      <span className="flex-grow text-center">{text}</span>
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
}