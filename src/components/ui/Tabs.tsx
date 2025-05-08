import React, { createContext, useContext, useState } from 'react';

type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className = '',
  ...props
}) => {
  const [tabValue, setTabValue] = useState(defaultValue);
  
  const controlled = value !== undefined;
  const currentValue = controlled ? value : tabValue;
  
  const handleValueChange = (value: string) => {
    if (!controlled) {
      setTabValue(value);
    }
    onValueChange?.(value);
  };
  
  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={`${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a Tabs component');
  }
  return context;
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div 
      role="tablist" 
      className={`inline-flex items-center justify-center rounded-lg bg-gray-100 p-1 dark:bg-gray-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  disabled = false,
  children,
  className = '',
  ...props
}) => {
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isSelected = selectedValue === value;
  
  return (
    <button
      role="tab"
      type="button"
      aria-selected={isSelected}
      disabled={disabled}
      data-state={isSelected ? 'active' : 'inactive'}
      onClick={() => onValueChange(value)}
      className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium 
        transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        disabled:pointer-events-none disabled:opacity-50
        ${isSelected 
          ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100' 
          : 'text-gray-600 hover:bg-gray-200/40 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/40 dark:hover:text-gray-100'
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className = '',
  ...props
}) => {
  const { value: selectedValue } = useTabsContext();
  const isSelected = selectedValue === value;
  
  if (!isSelected) return null;
  
  return (
    <div
      role="tabpanel"
      data-state={isSelected ? 'active' : 'inactive'}
      className={`
        rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};