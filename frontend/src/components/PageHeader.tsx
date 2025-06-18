import { ReactElement } from "react";

interface PageHeaderProps {
  icon: ReactElement;
  title: string;
  description: string;
  subtitle?: string;
}

export function PageHeader({ icon, title, description, subtitle }: PageHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="mb-2 flex justify-center">
        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-md">
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
      
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        {title}
      </h1>
      
      <p className="text-lg text-gray-700 mb-4 max-w-2xl mx-auto">
        {description}
      </p>
      
      {subtitle && (
        <p className="text-gray-600 max-w-xl mx-auto leading-relaxed mb-8">
          {subtitle}
        </p>
      )}
    </div>
  );
}