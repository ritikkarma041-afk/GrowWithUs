import React from 'react';
import { Role } from '../../../data/accessControlData';
import { PlusCircle, Edit, Trash2, Users } from 'lucide-react';

interface RoleListProps {
  roles: Role[];
  selectedRoleId: string | null;
  onSelectRole: (id: string) => void;
  onAddRole: () => void;
  onEditRole: (role: Role) => void;
  onDeleteRole: (role: Role) => void;
}

const RoleList: React.FC<RoleListProps> = ({ roles, selectedRoleId, onSelectRole, onAddRole, onEditRole, onDeleteRole }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Roles</h3>
        <button onClick={onAddRole} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-full">
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-2">
        {roles.map(role => (
          <div
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            className={`group p-3 rounded-lg cursor-pointer transition-colors flex justify-between items-start ${
              selectedRoleId === role.id ? 'bg-emerald-100 border border-emerald-200' : 'hover:bg-gray-100'
            }`}
          >
            <div>
              <p className={`font-semibold ${selectedRoleId === role.id ? 'text-emerald-800' : 'text-gray-800'}`}>{role.name}</p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <Users className="w-3 h-3 mr-1.5" />
                {role.userCount} users
              </p>
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); onEditRole(role); }} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-md">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDeleteRole(role); }} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-md">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleList;
