'use client';
import { useFormikContext } from 'formik';
import React from 'react';
import { cn } from '../../lib/utils';

const widthClass: Record<string, string> = {
  // Tailwin css width
  sm: 'w-32',
  md: 'w-48',
  lg: 'w-64',
  full: 'w-full',
};
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  showLabel?: Boolean;
  isRequired?: Boolean;
  id: string;
  name: string;
  width?: 'sm' | 'md' | 'lg' | 'full';
  rows?: number;
  direction?: 'vertical' | 'horizontal';
  suffix?: React.ReactNode;
}
const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label = 'No label',
      showLabel = true,
      isRequired = false,
      id,
      name,
      width = 'full',
      rows = 3,
      direction = 'vertical',
      suffix,
      className = '',
      ...props
    },
    ref,
  ) => {
    const { values, errors, touched, setFieldValue } = useFormikContext<any>();

    const fieldValue = values?.[name] ?? '';
    const fieldError = errors?.[name] as string | undefined;
    const fieldTouched = touched?.[name] as boolean | undefined;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFieldValue(name, e.target.value);
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
              <textarea
                id={id}
                name={name}
                rows={rows}
                value={fieldValue}
                onChange={handleChange}
                className={cn(
                  'rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500',
                  'disabled:cursor-not-allowed disabled:bg-gray-100',
                  widthClass[width],
                  className,
                )}
                ref={ref}
                {...props}
              />
            </div>
            {suffix && <div className="ml-2">{suffix}</div>}
          </div>
          {fieldTouched && fieldError && <p className="text-red-500 text-sm">{fieldError}</p>}
        </div>
      </>
    );
  },
);
TextArea.displayName = 'TextArea';

export { TextArea };
