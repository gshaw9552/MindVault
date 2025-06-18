import { Button } from "./Buttons";
import { ReactElement } from "react";

interface EmptyStateProps {
  icon?: ReactElement;
  title: string;
  description?: string;
  buttonText?: string;
  buttonIcon?: ReactElement;
  onButtonClick?: () => void;
  showButton?: boolean;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  buttonText, 
  buttonIcon, 
  onButtonClick, 
  showButton = true 
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <div className="text-gray-400">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
        {description}
      </p>
      {showButton && buttonText && onButtonClick && (
        <Button
          text={buttonText}
          variant="primary"
          onClick={onButtonClick}
          startIcon={buttonIcon}
        />
      )}
    </div>
  );
}