import React, { useState } from 'react';
import type { FormField } from '../types';
import { Input } from './Input';
import { Button } from './Button';
import { createLogger } from '../utils/debug';

interface FormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  submitText?: string;
  className?: string;
}

const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  submitText = 'Submit',
  className = ''
}) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formLogger = createLogger('Form');

  const handleFieldChange = (fieldName: string, value: any) => {
    formLogger.debug('Field value changed', { fieldName, value });
    setValues(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value.trim() === '')) {
      return `${field.label} is required`;
    }
    
    if (field.validation) {
      const { minLength, maxLength, pattern, custom } = field.validation;
      
      if (minLength && value.length < minLength) {
        return `${field.label} must be at least ${minLength} characters`;
      }
      
      if (maxLength && value.length > maxLength) {
        return `${field.label} must be no more than ${maxLength} characters`;
      }
      
      if (pattern && !pattern.test(value)) {
        return `${field.label} format is invalid`;
      }
      
      if (custom && typeof custom === 'function') {
        const customResult = custom(value);
        if (customResult !== null) {
          return customResult;
        }
      }
    }
    
    return null;
  };

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      const error = validateField(field, values[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    formLogger.info('Form submission started', { values });
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      formLogger.warn('Form validation failed', { errors: validationErrors });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
      formLogger.info('Form submission successful');
    } catch (error) {
      formLogger.error('Form submission failed', { error });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {fields.map(field => (
        <div key={field.name}>
          <Input
            name={field.name}
            label={field.label}
            type={field.type || 'text'}
            value={values[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            error={errors[field.name]}
            required={field.required}
          />
        </div>
      ))}
      
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isSubmitting}
        disabled={isSubmitting}
        className="w-full"
      >
        {submitText}
      </Button>
    </form>
  );
};

export { Form };
