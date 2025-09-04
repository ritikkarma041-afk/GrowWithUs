import React, { useState, useMemo } from 'react';
import { faker } from '@faker-js/faker';
import { Search, Save, X, Users } from 'lucide-react';

type Role = 'admin' | 'manager' | 'staff' | 'client' | 'auditor';
interface UserWithRole {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
}

const generateMockUsers = (count: number): UserWithRole[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatarLegacy(),
    role: faker.helpers.arrayElement<Role>(['admin', 'manager', 'staff', 'client', 'auditor']),
  }));
};

const ROLES: Role[] = ['admin', 'manager', 'staff', 'client', 'auditor'];

const RoleBadge: React.FC<{ role: Role }> = ({ role }) => {
  const roleStyles: Record<Role, string> = {
    admin: 'bg-red-100 text-red-800',
    manager: 'bg-blue-100 text-blue-800',
    staff: 'bg-yellow-100 text-yellow-800',
    client: 'bg-emerald-100 text-emerald-800',
    auditor: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${roleStyles[role]}`}>
      {role}
    </span>
  );
};

const RolesAndPermissions: React.FC = () => {
  const [users, setUsers] = useState<UserWithRole[]>(() => generateMockUsers(20));
  const [searchTerm, setSearchTerm] = useState('');
  const [editedRoles, setEditedRoles] = useState<Record<string, Role>>({});

  const hasChanges = Object.keys(editedRoles).length > 0;

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleRoleChange = (userId: string, newRole: Role) => {
    setEditedRoles(prev => ({
      ...prev,
      [userId]: newRole,
    }));
  };

  const handleSaveChanges = () => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        editedRoles[user.id] ? { ...user, role: editedRoles[user.id] } : user
      )
    );
    setEditedRoles({});
    // Here you would typically make an API call to save the changes
    alert('Roles updated successfully!');
  };

  const handleDiscardChanges = () => {
    setEditedRoles({});
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Roles & Permissions</h2>
          <p className="text-sm text-gray-500">Assign roles to users to manage their access levels.</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/70">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Role</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={editedRoles[user.id] || user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value as Role)}
                    className="w-full max-w-[150px] px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm capitalize"
                  >
                    {ROLES.map(role => (
                      <option key={role} value={role} className="capitalize">{role}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
             {filteredUsers.length === 0 && (
                <tr>
                    <td colSpan={3} className="text-center py-12">
                        <div className="flex flex-col items-center text-gray-500">
                            <Users className="w-12 h-12 mb-4" />
                            <h3 className="text-lg font-semibold">No Users Found</h3>
                            <p className="text-sm">Your search for "{searchTerm}" did not return any results.</p>
                        </div>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {hasChanges && (
        <div className="sticky bottom-0 mt-6 -mx-8 -mb-8 px-8 py-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 flex justify-end items-center space-x-4 animate-slide-up">
          <p className="text-sm text-gray-600">You have unsaved changes.</p>
          <button
            onClick={handleDiscardChanges}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Discard</span>
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RolesAndPermissions;
