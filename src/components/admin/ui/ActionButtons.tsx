import React from 'react';

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDelete();
    }
  };

  return (
    <div className="flex space-x-4 mt-4">
      <button
        onClick={onEdit}
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        aria-label="Modify"
      >
        Modify
      </button>
      <button
        onClick={handleDelete}
        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
        aria-label="Delete"
      >
        Delete
      </button>
    </div>
  );
};

export default ActionButtons;
