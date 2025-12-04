'use client';
import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from '../../lib/utils';

interface DateTimePickerProps {
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
  labelWidth?: 'sm' | 'md' | 'lg' | 'auto';
}

const widthClass: Record<string, string> = {
  sm: 'w-32',
  md: 'w-48',
  lg: 'w-64',
  full: 'w-full',
};
const labelWidthClass: Record<string, string> = {
  sm: 'w-24', // ~96px
  md: 'w-32', // ~128px
  lg: 'w-40', // ~160px
  auto: 'w-auto',
};
export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  id,
  name,
  label,
  showLabel = true,
  isRequired = false,
  width = 'full',
  direction = 'vertical',
  value = null,
  onChange: propOnChange,
  className = '',
  error = '',
  touched = false,
  labelWidth = 'md',
}) => {
  return (
    <div
      className={cn(
        'flex mb-3',
        direction === 'vertical' ? 'flex-col gap-1' : 'items-center gap-3',
      )}
    >
      {showLabel && (
        <label
          htmlFor={name}
          className={cn(
            'block text-sm font-medium text-gray-800',
            direction === 'horizontal' && [
              labelWidthClass[labelWidth ?? 'auto'],
              'break-words whitespace-normal flex-shrink-0',
            ],
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
      <div
        className={cn(
          'flex items-center',
          direction === 'horizontal' ? 'flex-1' : widthClass[width],
        )}
      >
        <div className={cn(widthClass[width])}>
          <div className={'customDatePickerWidthFull'}>
            <ReactDatePicker
              id={id}
              name={name}
              selected={value}
              onChange={propOnChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy/MM/dd HH:mm"
              placeholderText="yyyy/MM/dd HH:mm"
              className={cn(
                'h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500',
                'disabled:cursor-not-allowed disabled:bg-gray-100',
                widthClass[width],
                className,
              )}
            />

            {touched && error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
