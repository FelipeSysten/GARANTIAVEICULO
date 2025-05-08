import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline';
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-lg overflow-hidden transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg',
    outline: 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div 
      className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <h3 
      className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`} 
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div 
      className={`px-6 py-4 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div 
      className={`px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;