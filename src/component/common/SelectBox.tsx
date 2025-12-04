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
interface SelectBoxProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  id: string;
  label?: string;
  name: string;
  options: { value: string; label: string }[];
  isRequired?: boolean;
  width?: 'sm' | 'md' | 'lg' | 'full';
  direction?: 'vertical' | 'horizontal';
  classNameSelect?: string;
  classNameParent?: string;
  suffix?: React.ReactNode;
  labelWidth?: 'sm' | 'md' | 'lg' | 'auto';
}
const SelectBox = React.forwardRef<HTMLSelectElement, SelectBoxProps>(
  (
    {
      id,
      label = '',
      name,
      options,
      isRequired = false,
      width = 'md',
      direction = 'vertical',
      classNameSelect = '',
      classNameParent = '',
      suffix,
      labelWidth = 'md',
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

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (formik) {
        formik.setFieldValue(name, e.target.value);
      }
      if (props.onChange) props.onChange(e);
    };

    return (
      <div
        className={cn(
          'flex mb-3',
          direction === 'vertical' ? 'flex-col gap-1' : 'items-center gap-3',
          classNameParent,
        )}
      >
        {label && (
          <label
            htmlFor={id}
            className={cn(
              'block text-gray-800 text-md font-medium',
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
          <div className="w-full">
            <select
              id={id}
              value={fieldValue}
              onChange={handleChange}
              {...props}
              className={cn(
                'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500',
                'disabled:cursor-not-allowed disabled:bg-gray-100',
                widthClass[width],
                classNameSelect,
              )}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {fieldTouched && fieldError && <p className="text-red-500 text-sm">{fieldError}</p>}
          </div>

          {suffix && <div className="ml-2">{suffix}</div>}
        </div>
      </div>
    );
  },
);

export default SelectBox;
