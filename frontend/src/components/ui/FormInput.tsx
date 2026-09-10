import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { LucideIcon } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  icon: Icon,
  registration,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[0.85rem] font-semibold text-ink-muted">
        {Icon && <Icon size={16} />}
        <span>{label}</span>
      </label>
      <input
        {...registration}
        {...props}
        className={`w-full rounded-field border bg-input px-3.5 py-2.5 text-[0.92rem] text-ink outline-none transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] placeholder:text-ink-dim focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-glow)] ${
          error ? 'border-red-400 focus:border-red-400' : 'border-white/10'
        } ${className}`}
      />
      {error && <span className="text-[0.78rem] text-red-400 font-medium">{error.message}</span>}
    </div>
  );
};
