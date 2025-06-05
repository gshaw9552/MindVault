import { ReactElement } from "react";

interface ButtonProps {
  /** Now include HTML button types */
  type?: "button" | "submit" | "reset";

  variant: "primary" | "secondary" | "danger" | "outline";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantClasses: Record<ButtonProps["variant"], string> = {
  primary: "bg-purple-600 text-white hover:bg-purple-700",
  secondary: "bg-purple-200 text-purple-600 hover:bg-purple-300",
  danger: "bg-red-500 text-white hover:bg-red-600",
  outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
};

const defaultStyles = "px-4 py-2 rounded-md font-light flex items-center";

export function Button(props: ButtonProps) {
  const {
    type = "button",   // default type is "button" unless overwritten
    variant,
    text,
    startIcon,
    endIcon,
    onClick,
    fullWidth,
    loading,
  } = props;

  const classes = [
    variantClasses[variant],
    defaultStyles,
    fullWidth ? "w-full justify-center" : "",
    loading ? "opacity-50 cursor-not-allowed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={loading}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      <span className="flex-grow text-center">{text}</span>
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
}
