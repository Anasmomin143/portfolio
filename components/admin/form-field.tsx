'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

interface BaseFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'url' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  minLength?: number;
}

interface TextareaFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function FormInput({
  label,
  required,
  error,
  hint,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled,
  maxLength,
  minLength,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        className={error ? 'border-destructive' : ''}
      />
      {maxLength && (
        <p className="text-xs text-muted-foreground text-right">
          {value.length}/{maxLength}
        </p>
      )}
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function FormTextarea({
  label,
  required,
  error,
  hint,
  value,
  onChange,
  placeholder,
  rows = 4,
}: TextareaFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={error ? 'border-destructive' : ''}
      />
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function FormSelect({
  label,
  required,
  error,
  hint,
  value,
  onChange,
  options,
  placeholder,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger className={error ? 'border-destructive' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface CheckboxFieldProps extends Omit<BaseFieldProps, 'required'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
}

export function FormCheckbox({
  label,
  checked,
  onChange,
  disabled,
  error,
  hint,
  description,
}: CheckboxFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-3">
        <Checkbox
          id={label}
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          className={error ? 'border-destructive' : ''}
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor={label}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {label}
          </Label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {hint && <p className="text-sm text-muted-foreground ml-7">{hint}</p>}
      {error && <p className="text-sm text-destructive ml-7">{error}</p>}
    </div>
  );
}

interface SwitchFieldProps extends Omit<BaseFieldProps, 'required'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
}

export function FormSwitch({
  label,
  checked,
  onChange,
  disabled,
  error,
  hint,
  description,
}: SwitchFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex-1 space-y-1">
          <Label htmlFor={label} className="text-sm font-medium">
            {label}
          </Label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <Switch
          id={label}
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
        />
      </div>
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface NumberFieldProps extends BaseFieldProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  showStepper?: boolean;
}

export function FormNumber({
  label,
  required,
  error,
  hint,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  disabled,
  showStepper = true,
}: NumberFieldProps) {
  const handleIncrement = () => {
    const currentValue = value || 0;
    const newValue = parseFloat((currentValue + step).toFixed(10)); // Fix floating point precision
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    const currentValue = value || 0;
    const newValue = parseFloat((currentValue - step).toFixed(10)); // Fix floating point precision
    if (min === undefined || newValue >= min) {
      onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input
    if (inputValue === '') {
      onChange(0);
      return;
    }

    const numValue = parseFloat(inputValue);

    // Only update if it's a valid number
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <Input
          type="number"
          value={value || ''}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          step={step}
          className={error ? 'border-destructive' : showStepper ? 'pr-16' : ''}
        />
        {showStepper && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0 border border-input rounded overflow-hidden bg-background shadow-sm">
            <button
              type="button"
              onClick={handleIncrement}
              disabled={disabled || (max !== undefined && (value || 0) >= max)}
              className="px-2.5 py-1 text-xs hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-b border-input leading-none"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={handleDecrement}
              disabled={disabled || (min !== undefined && (value || 0) <= min)}
              className="px-2.5 py-1 text-xs hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors leading-none"
            >
              ▼
            </button>
          </div>
        )}
      </div>
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface DateFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function FormDate({
  label,
  required,
  error,
  hint,
  value,
  onChange,
  min,
  max,
  disabled,
}: DateFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        className={error ? 'border-destructive' : ''}
      />
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface UrlFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function FormUrl({
  label,
  required,
  error,
  hint,
  value,
  onChange,
  placeholder,
  disabled,
}: UrlFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'https://example.com'}
        disabled={disabled}
        required={required}
        className={error ? 'border-destructive' : ''}
      />
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface EmailFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function FormEmail({
  label,
  required,
  error,
  hint,
  value,
  onChange,
  placeholder,
  disabled,
}: EmailFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'example@email.com'}
        disabled={disabled}
        required={required}
        className={error ? 'border-destructive' : ''}
      />
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
