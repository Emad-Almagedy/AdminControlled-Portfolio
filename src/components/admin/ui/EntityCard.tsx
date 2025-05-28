import React from 'react';

interface EntityCardProps {
  children: React.ReactNode;
  className?: string;
}

const EntityCard: React.FC<EntityCardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className || ''}`}>
      {children}
    </div>
  );
};

export default EntityCard;
