
interface InputProps {
    placeholder: string;
    type?: string;
    ref?: any;
  }
  
  export function Input({ placeholder, type = "text", ref}: InputProps) {
  
    return (
      <div className="w-full">
        <input
          ref={ref}
          placeholder={placeholder}
          type={type}
          className="px-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>
    );
  }  