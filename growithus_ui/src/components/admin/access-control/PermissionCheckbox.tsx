import React from 'react';

interface PermissionCheckboxProps {
  label: string;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
}

const PermissionCheckbox: React.FC<PermissionCheckboxProps> = ({ label, isChecked, onChange }) => {
  const id = `checkbox-${label.toLowerCase()}`;

  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
      />
      <label htmlFor={id} className="ml-2 block text-sm text-gray-700 cursor-pointer">
        {label}
      </label>
    </div>
  );
};

export default PermissionCheckbox;
