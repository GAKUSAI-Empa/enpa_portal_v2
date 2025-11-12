'use client';
import { getIn, useFormikContext } from 'formik';
import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from '../../lib/utils';

interface DatePickerProps {
  id: string;
  name?: string;
  label?: string;
  width?: 'sm' | 'md' | 'lg' | 'full';
  value?: Date | string | null; // standalone
  onChange?: (date: Date | null) => void; // standalone
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
  width = 'full',
  value: propValue,
  onChange: propOnChange,
}) => {
  let formikContext;
  try {
    formikContext = useFormikContext<any>();
  } catch {
    formikContext = null; // không có Formik
  }

  const fieldValue: Date | null =
    name && formikContext
      ? (getIn(formikContext.values, name) ?? null)
      : typeof propValue === 'string'
        ? propValue
          ? new Date(propValue)
          : null
        : (propValue ?? null);

  const fieldError = name && formikContext ? getIn(formikContext.errors, name) : undefined;
  const fieldTouched = name && formikContext ? getIn(formikContext.touched, name) : undefined;

  const handleChange = (date: Date | null) => {
    if (name && formikContext) {
      formikContext.setFieldValue(name, date);
    }
    propOnChange?.(date);
  };

  return (
    <div className="mb-3 flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-800">
          {label}
        </label>
      )}
      <ReactDatePicker
        id={id}
        selected={fieldValue}
        onChange={handleChange}
        className={cn('rounded-md border border-gray-300 px-3 py-2 text-sm', widthClass[width])}
        dateFormat="yyyy/MM/dd"
        placeholderText="yyyy/MM/dd"
      />
      {fieldTouched && fieldError && <p className="text-red-500 text-sm">{fieldError}</p>}
    </div>
  );
};
