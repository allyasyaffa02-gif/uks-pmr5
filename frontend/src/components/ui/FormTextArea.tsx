import React from "react";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { ChipsItem } from "../../modules/uks/types/uks";
import {
  FIELD_WRAPPER_CLASS,
  FIELD_LABEL_CLASS,
  FIELD_ERROR_CLASS,
  getFieldClass,
} from "./fieldStyles";

export interface FormTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  suggestions?: ChipsItem[];
  /** Callback saat chip suggestion diklik */
  onSuggestionClick?: (suggestionValue: string) => void;
  /** Deprecated alias untuk onSuggestionClick */
  suggestionsClick?: (suggestionValue: string) => void;
  icon?: LucideIcon;
  registration?: UseFormRegisterReturn;
  error?: FieldError;
  containerClassName?: string;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  suggestions = [],
  onSuggestionClick,
  suggestionsClick,
  icon: Icon,
  registration,
  error,
  rows = 3,
  containerClassName = "",
  className = "",
  id,
  name,
  ...props
}) => {
  const handleSuggestion = onSuggestionClick || suggestionsClick;
  const areaId = id || name || registration?.name;

  return (
    <div className={`${FIELD_WRAPPER_CLASS} ${containerClassName}`.trim()}>
      {(label || suggestions.length > 0) && (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {label ? (
            <label htmlFor={areaId} className={FIELD_LABEL_CLASS}>
              {Icon && <Icon size={16} className="text-primary shrink-0" />}
              <span>{label}</span>
            </label>
          ) : (
            <div />
          )}

          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleSuggestion?.(s.value)}
                  type="button"
                  className="text-[11px] font-semibold bg-surface-container-low px-2 py-0.5 rounded text-secondary hover:text-primary hover:bg-surface-container-high transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <textarea
        id={areaId}
        {...registration}
        {...props}
        rows={rows}
        className={getFieldClass(error, className, true)}
      />

      {error && (
        <span className={FIELD_ERROR_CLASS}>{error.message}</span>
      )}
    </div>
  );
};

export default FormTextArea;

