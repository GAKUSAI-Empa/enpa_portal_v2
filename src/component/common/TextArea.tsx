'use client';
import { getIn, useFormikContext } from 'formik';
import React from 'react';
import { cn } from '../../lib/utils';

const widthClass: Record<string, string> = {
  // Tailwin css width
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
  labelWidth?: 'sm' | 'md' | 'lg' | 'auto';
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
      labelWidth = 'md',
      className = '',
      ...props
    },
    ref,
  ) => {
    let formik: any = null;
    try {
      formik = useFormikContext();
    } catch (e) {
      formik = null;
    }

    const fieldValue = formik ? (getIn(formik.values, name) ?? '') : (props.value ?? '');
    const fieldError = formik ? (getIn(formik.errors, name) as string | undefined) : undefined;
    const fieldTouched = formik ? (getIn(formik.touched, name) as boolean | undefined) : false;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (formik) {
        formik.setFieldValue(name, e.target.value);
      }
      if (props.onChange) props.onChange(e);
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
                'block text-md font-medium text-gray-800',
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
              {fieldTouched && fieldError && <p className="text-red-500 text-sm">{fieldError}</p>}
            </div>
            {suffix && <div className="ml-2">{suffix}</div>}
          </div>
        </div>
      </>
    );
  },
);
TextArea.displayName = 'TextArea';

export { TextArea };
