export interface InputValidation {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  customMessage?: string;
}

export interface InputProps {
  type: "text" | "email" | "password" | "tel" | "url";
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value?: string;
  className?: string;
  validation?: InputValidation;
}