'use client';

import * as React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export function Tabs({ value, onValueChange, children }: TabsProps) {
  return (
    <div>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        // Cast child to ReactElement to avoid type errors
        const typedChild = child as React.ReactElement<any>;
        if (typedChild.type === TabsTrigger || typedChild.type === TabsContent) {
          return React.cloneElement(typedChild, { activeValue: value, onValueChange });
        }
        return child;
      })}
    </div>
  );
}

interface TabsListProps {
  children: React.ReactNode;
}

export function TabsList({ children }: TabsListProps) {
  return <div className="flex border-b border-gray-200">{children}</div>;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  activeValue?: string;
}

export function TabsTrigger({ value, children, onValueChange, activeValue }: TabsTriggerProps) {
  const isActive = value === activeValue;
  return (
    <button
      className={`px-4 py-2 -mb-px border-b-2 font-medium ${
        isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
      onClick={() => onValueChange && onValueChange(value)}
      type="button"
      aria-selected={isActive}
      role="tab"
      tabIndex={isActive ? 0 : -1}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  activeValue?: string;
}

export function TabsContent({ value, children, activeValue }: TabsContentProps) {
  if (value !== activeValue) return null;
  return <div className="p-4">{children}</div>;
}
