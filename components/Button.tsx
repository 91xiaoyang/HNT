import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'outline';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-white text-indigo-600 border-2 border-indigo-100 hover:bg-indigo-50",
    success: "bg-green-500 text-white hover:bg-green-600",
    outline: "border-2 border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`} 
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </button>
  );
};
