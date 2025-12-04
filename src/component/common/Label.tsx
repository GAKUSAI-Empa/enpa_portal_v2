'use client';
import { cn } from '@/lib/utils';
import React from 'react';

const labelWidthClass: Record<string, string> = {
  sm: 'w-24', // ~96px
  md: 'w-32', // ~128px
  lg: 'w-40', // ~160px
  auto: 'w-auto',
};
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  labelWidth?: 'sm' | 'md' | 'lg' | 'auto';
}
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ labelWidth = 'md', className = '', children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'block text-sm font-semibold text-gray-800 mb-2 whitespace-nowrap',
          className,
          labelWidthClass[labelWidth ?? 'auto'],
        )}
        {...props}
      >
        {children}
      </label>
    );
  },
);

export default Label;
