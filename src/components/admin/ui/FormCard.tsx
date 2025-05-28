import React from 'react';

interface FormCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const FormCard: React.FC<FormCardProps> = ({ title, children, className }) => {
  return (
    <div
      className={"bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border-2 border-transparent dark:border-primary transition-colors duration-300 ease-in-out " + (className || "")}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-primary">{title}</h2>
      {children}
    </div>
  );
};

export default FormCard;
