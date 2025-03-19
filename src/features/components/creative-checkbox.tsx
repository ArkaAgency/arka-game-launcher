import clsx from 'clsx';
import { Check } from 'lucide-react';
import React from 'react';

interface CreativeCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export default function CreativeCheckbox({
  className,
  label,
  description,
  checked: controlledChecked,
  defaultChecked,
  onChange,
  ...props
}: CreativeCheckboxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [checked, setChecked] = React.useState(defaultChecked || false);

  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : checked;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setChecked(event.target.checked);
    }
    onChange?.(event);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={clsx('flex items-start space-x-3', className)}>
      <div
        onClick={handleClick}
        className={clsx(
          'relative flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-input ring-offset-background transition-all',
          'cursor-pointer hover:border-primary/50 hover:bg-muted',
          isChecked &&
            'border-primary bg-primary hover:bg-primary/90 hover:border-primary',
        )}
      >
        <input
          type="checkbox"
          ref={inputRef}
          checked={isChecked}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
        <Check
          className={clsx(
            'h-4 w-4 text-primary-foreground transition-opacity',
            isChecked ? 'opacity-100' : 'opacity-0',
          )}
        />
        <span
          className={clsx(
            'absolute inset-0 rounded-md ring-2 ring-offset-2 ring-offset-background transition-opacity',
            props.disabled ? 'opacity-0' : 'opacity-0 focus-within:opacity-100',
          )}
        />
      </div>
      {(label || description) && (
        <div className="grid gap-1.5 leading-none">
          {label && (
            <label
              htmlFor={props.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              onClick={handleClick}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
