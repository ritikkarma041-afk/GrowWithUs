import React, { useState } from 'react';
import { Role, Module, Permission } from '../../../data/accessControlData';
import PermissionCheckbox from './PermissionCheckbox';
import { Save, ShieldQuestion } from 'lucide-react';

interface RoleDetailProps {
  role: Role | null;
  modules: Module[];
  permissions: Permission[];
  onPermissionChange: (moduleId: string, permissionType: keyof Omit<Permission, 'roleId' | 'moduleId'>, value: boolean) => void;
}

const RoleDetail: React.FC<RoleDetailProps> = ({ role, modules, permissions, onPermissionChange }) => {
  const [hasChanges, setHasChanges] = useState(false);

  const handleCheckboxChange = (moduleId: string, permissionType: keyof Omit<Permission, 'roleId' | 'moduleId'>, value: boolean) => {
    onPermissionChange(moduleId, permissionType, value);
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would trigger an API call
    alert(`Permissions for role "${role?.name}" saved!`);
    setHasChanges(false);
  };

  if (!role) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6 h-full flex flex-col justify-center items-center text-center">
        <ShieldQuestion className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">Select a Role</h3>
        <p className="text-gray-500 mt-2">Choose a role from the left to view and edit its permissions.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{role.name}</h2>
        <p className="text-sm text-gray-600 mt-1">{role.description}</p>
      </div>
      
      <div className="flex-grow overflow-y-auto -mr-3 pr-3">
        <div className="space-y-4">
          {modules.map(module => {
            const modulePermissions = permissions.find(p => p.moduleId === module.id);
            return (
              <div key={module.id} className="border border-gray-200 rounded-lg p-4 bg-white/50">
                <h4 className="font-semibold text-gray-800">{module.name}</h4>
                <p className="text-xs text-gray-500 mb-4">{module.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <PermissionCheckbox
                    label="Read"
                    isChecked={modulePermissions?.canRead || false}
                    onChange={(isChecked) => handleCheckboxChange(module.id, 'canRead', isChecked)}
                  />
                  <PermissionCheckbox
                    label="Write"
                    isChecked={modulePermissions?.canWrite || false}
                    onChange={(isChecked) => handleCheckboxChange(module.id, 'canWrite', isChecked)}
                  />
                  <PermissionCheckbox
                    label="Update"
                    isChecked={modulePermissions?.canUpdate || false}
                    onChange={(isChecked) => handleCheckboxChange(module.id, 'canUpdate', isChecked)}
                  />
                  <PermissionCheckbox
                    label="Delete"
                    isChecked={modulePermissions?.canDelete || false}
                    onChange={(isChecked) => handleCheckboxChange(module.id, 'canDelete', isChecked)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {hasChanges && (
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end animate-fade-in">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Permissions</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleDetail;
