'use client';
import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from '../../lib/utils';

interface DatePickerProps {
  id: string;
  name?: string;
  label?: string;
  showLabel?: Boolean;
  isRequired?: Boolean;
  width?: 'sm' | 'md' | 'lg' | 'full';
  direction?: 'vertical' | 'horizontal';
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  className?: string;
  error?: string;
  touched?: boolean;
}

const widthClass: Record<string, string> = {
  sm: 'w-32',
  md: 'w-48',
  lg: 'w-64',
  full: 'w-full',
};

export const DatePicker: React.FC<DatePickerProps> = ({
  id,
  name,
  label,
  showLabel,
  isRequired = false,
  width = 'full',
  direction = 'vertical',
  value = null,
  onChange: propOnChange,
  className = '',
  error = '',
  touched = false,
}) => {
  return (
    <div className="mb-3 flex flex-col gap-1">
      {showLabel && (
        <label
          htmlFor={name}
          className={cn(
            'block text-sm font-medium text-gray-800',
            direction === 'horizontal' && 'whitespace-nowrap',
          )}
        >
          {label}
          {isRequired === true ? (
            <span className="text-red-500 mr-1" aria-hidden="true">
              *
            </span>
          ) : (
            <></>
          )}
        </label>
      )}
      <ReactDatePicker
        id={id}
        name={name}
        selected={value}
        onChange={propOnChange}
        className={cn(
          'h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500',
          'disabled:cursor-not-allowed disabled:bg-gray-100',
          widthClass[width],
          className,
        )}
        dateFormat="yyyy/MM/dd"
        placeholderText="yyyy/MM/dd"
      />
      {touched && error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};
