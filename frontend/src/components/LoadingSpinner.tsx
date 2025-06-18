interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ message = "Loading...", size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div className={`${sizeClasses[size]} border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4`}></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}