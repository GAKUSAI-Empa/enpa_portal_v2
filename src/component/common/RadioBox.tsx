'use client';

import { cn } from '@/lib/utils';
import { useFormikContext } from 'formik';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface RadioContextType {
  selectedValue: string;
  onChange: (value: string) => void;
  name?: string;
}

const RadioContext = createContext<RadioContextType | null>(null);

interface RadioGroupProps {
  label?: string;
  isRequired?: boolean;
  name: string;
  direction?: 'vertical' | 'horizontal';
  children: React.ReactNode;
  className?: string;
  value?: string; // external control (non-Formik)
  onChange?: (value: string) => void;
}

const Group: React.FC<RadioGroupProps> = ({
  label = '',
  isRequired = false,
  name,
  direction = 'vertical',
  children,
  className = '',
  value,
  onChange,
}) => {
  let formik: any = null;

  try {
    formik = useFormikContext();
  } catch (e) {
    formik = null;
  }

  const formikValue = formik ? formik.values?.[name] : undefined;
  const formikError = formik ? formik.errors?.[name] : undefined;
  const formikTouched = formik ? formik.touched?.[name] : undefined;

  const [selectedValue, setSelectedValue] = useState(formikValue ?? value ?? '');

  const handleChange = (v: string) => {
    setSelectedValue(v);

    if (formik) {
      formik.setFieldValue(name, v);
    } else if (onChange) {
      onChange(v);
    }
  };

  useEffect(() => {
    if (formik && formikValue !== selectedValue) {
      setSelectedValue(formikValue);
    }
  }, [formikValue]);

  return (
    <RadioContext.Provider value={{ selectedValue, onChange: handleChange, name }}>
      {label && (
        <label
          className={cn(
            'block font-medium text-md text-gray-800 mb-2',
            direction === 'horizontal' && 'whitespace-nowrap',
          )}
        >
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={cn(
          direction === 'horizontal' ? 'flex -rowflex space-x-4' : 'flex flex-col space-y-2',
          className,
        )}
      >
        {children}
      </div>

      {/* Error chỉ hiển thị nếu có Formik */}
      {formik && formikTouched && formikError && (
        <p className="text-red-500 text-sm">{formikError}</p>
      )}
    </RadioContext.Provider>
  );
};

interface OptionProps {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Option: React.FC<OptionProps> = ({ value, disabled = false, children, className }) => {
  const context = useContext(RadioContext);
  if (!context) throw new Error('Radio.Option must be inside Radio.Group');

  const checked = context.selectedValue === value;

  return (
    <label
      className={cn(
        'flex items-center cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <input
        type="radio"
        name={context.name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => context.onChange(value)}
        className="hidden"
      />

      <span
        className={`w-5 h-5 flex items-center justify-center border-2 rounded-full mr-2
          ${checked ? 'border-primary bg-primary' : 'border-gray-400'}`}
      >
        {checked && <span className="w-2.5 h-2.5 bg-white rounded-full" />}
      </span>

      <span>{children}</span>
    </label>
  );
};

const RadioBox = {
  Group,
  Option,
};

export default RadioBox;
