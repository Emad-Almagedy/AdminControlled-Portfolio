import React, { ReactNode } from 'react';
import { Button } from '../../ui/Button';

interface FormLayoutProps {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  submitLabel?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const FormLayout: React.FC<FormLayoutProps> = ({
  title,
  onSubmit,
  isLoading,
  submitLabel = 'Save',
  children,
  footer,
}) => {
  return (
    <div className="container mx-auto p-6 bg-background dark:bg-background-dark rounded-lg transition-colors duration-300 ease-in-out max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 text-text-primary dark:text-text-primary-dark">{title}</h1>
      <form onSubmit={onSubmit} className="space-y-6">
        {children}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Saving...' : submitLabel}
        </Button>
        {footer && <div className="mt-4">{footer}</div>}
      </form>
    </div>
  );
};

export default FormLayout;
