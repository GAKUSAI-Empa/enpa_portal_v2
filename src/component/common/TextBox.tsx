'use client';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { getIn, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { cn } from '../../lib/utils';

const widthClass: Record<string, string> = {
  // Tailwin css width
  sm: 'w-32',
  md: 'w-48',
  lg: 'w-64',
  full: 'w-full',
};
interface TextBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showLabel?: Boolean;
  isRequired?: Boolean;
  id: string;
  name: string;
  width?: 'sm' | 'md' | 'lg' | 'full';
  direction?: 'vertical' | 'horizontal';
  suffix?: React.ReactNode;
}
const TextBox = React.forwardRef<HTMLInputElement, TextBoxProps>(
  (
    {
      label = 'No label',
      showLabel = true,
      isRequired = false,
      id,
      name,
      width = 'full',
      direction = 'vertical',
      suffix,
      className = '',
      type,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
      setShowPassword((prev) => !prev);
    };

    const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

    const { values, errors, touched, setFieldValue, isSubmitting } = useFormikContext<any>();

    const fieldValue = getIn(values, name) ?? '';
    const fieldError = getIn(errors, name) as string | undefined;
    const fieldTouched = getIn(touched, name) as boolean | undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue(name, e.target.value);
    };

    const renderFieldError = (error: any) => {
      if (!error) return null;
      if (typeof error === 'string') return <p className="text-red-500 text-sm">{error}</p>;
      if (Array.isArray(error))
        return error.map((err, idx) =>
          typeof err === 'string' ? (
            <p key={idx} className="text-red-500 text-sm">
              {err}
            </p>
          ) : null,
        );
      return null;
    };

    return (
      <>
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
          <div className="flex items-center">
            <div className="relative w-full">
              <input
                id={id}
                name={name}
                value={fieldValue}
                onChange={handleChange}
                type={inputType}
                className={cn(
                  'h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500',
                  'disabled:cursor-not-allowed disabled:bg-gray-100',
                  widthClass[width],
                  className,
                )}
                ref={ref}
                {...props}
              />
              {type === 'password' && (
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-opacity duration-150"
                  tabIndex={-1}
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              )}
            </div>
            {suffix && <div className="ml-2">{suffix}</div>}
          </div>
          {fieldTouched && renderFieldError(fieldError)}
        </div>
      </>
    );
  },
);
TextBox.displayName = 'TextBox';

export { TextBox };
