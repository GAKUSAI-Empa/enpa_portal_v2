'use client';
import { useFormikContext } from 'formik';
import { cn } from '../../lib/utils';

interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface CheckboxGroupProps {
  id: string;
  name: string;
  options: Option[];
  label?: string;
  showLabel?: boolean;
  isRequired?: boolean;
  direction?: 'vertical' | 'horizontal';
  directionOption?: 'vertical' | 'horizontal';
  className?: string;
}

const CheckboxGroup = ({
  id,
  name,
  options,
  label = 'No label',
  showLabel = true,
  isRequired = false,
  direction = 'vertical',
  directionOption = 'horizontal',
  className = '',
}: CheckboxGroupProps) => {
  const { values, errors, touched, setFieldValue } = useFormikContext<any>();
  const selected: (string | number)[] = values[name] || [];

  const handleChange = (value: string | number) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setFieldValue(name, newSelected);
  };

  const error = errors[name];
  const isTouched = touched[name];

  return (
    <div
      id={id}
      className={cn(
        'flex mb-3',
        direction === 'vertical' ? 'flex-col gap-1' : 'flex-row items-center gap-3',
        className,
      )}
    >
      {showLabel && (
        <div
          className={cn(
            'flex items-center mb-1',
            direction === 'horizontal' && 'whitespace-nowrap',
          )}
        >
          <span className="text-sm font-medium text-gray-800">{label}</span>
          {isRequired && <span className="text-red-500">*</span>}
        </div>
      )}

      <div
        className={cn(
          'flex gap-4 flex-wrap',
          directionOption === 'vertical' ? 'flex-col' : 'flex-row',
        )}
      >
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 w-auto">
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={selected.includes(option.value)}
              onChange={() => handleChange(option.value)}
              disabled={option.disabled}
              className="w-4 h-4 accent-primary"
            />
            {option.label}
          </label>
        ))}
      </div>

      {isTouched && error && (
        <p className="text-red-500 text-sm mt-1">{`${Array.isArray(error) ? error[0] : error}`}</p>
      )}
    </div>
  );
};

export { CheckboxGroup };
