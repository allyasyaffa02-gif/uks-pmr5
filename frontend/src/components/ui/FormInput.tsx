import React from "react";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import {
  FIELD_WRAPPER_CLASS,
  FIELD_LABEL_CLASS,
  FIELD_ERROR_CLASS,
  getFieldClass,
} from "./fieldStyles";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  registration?: UseFormRegisterReturn;
  error?: FieldError;
  containerClassName?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  icon: Icon,
  registration,
  error,
  containerClassName = "",
  className = "",
  id,
  name,
  ...props
}) => {
  const inputId = id || name || registration?.name;

  return (
    <div className={`${FIELD_WRAPPER_CLASS} ${containerClassName}`.trim()}>
      {label && (
        <label htmlFor={inputId} className={FIELD_LABEL_CLASS}>
          {Icon && <Icon size={16} className="text-primary shrink-0" />}
          <span>{label}</span>
        </label>
      )}
      <input
        id={inputId}
        {...registration}
        {...props}
        className={getFieldClass(error, className, false)}
      />
      {error && (
        <span className={FIELD_ERROR_CLASS}>{error.message}</span>
      )}
    </div>
  );
};

export default FormInput;

