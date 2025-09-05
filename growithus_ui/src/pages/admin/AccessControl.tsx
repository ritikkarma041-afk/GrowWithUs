import React, { useState, useMemo } from 'react';
import { faker } from '@faker-js/faker';
import PageHeader from '../../components/PageHeader';
import RoleList from '../../components/admin/access-control/RoleList';
import RoleDetail from '../../components/admin/access-control/RoleDetail';
import AddRoleModal from '../../components/admin/access-control/AddRoleModal';
import EditRoleModal from '../../components/admin/access-control/EditRoleModal';
import ActionConfirmationModal from '../../components/admin/ActionConfirmationModal';
import { initialRoles, initialModules, initialPermissions, Role, Module, Permission } from '../../data/accessControlData';

const AccessControl: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [modules] = useState<Module[]>(initialModules);
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(initialRoles[0]?.id || null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const selectedRole = useMemo(() => {
    return roles.find(r => r.id === selectedRoleId) || null;
  }, [selectedRoleId, roles]);

  const handleAddRole = (name: string, description: string) => {
    const newRole: Role = {
      id: faker.lorem.slug(),
      name,
      description,
      userCount: 0,
    };
    setRoles(prev => [...prev, newRole]);
    // Also create default (empty) permissions for this new role
    const newPermissions = modules.map(module => ({
      roleId: newRole.id,
      moduleId: module.id,
      canRead: false,
      canWrite: false,
      canUpdate: false,
      canDelete: false,
    }));
    setPermissions(prev => [...prev, ...newPermissions]);
    setIsAddModalOpen(false);
  };

  const handleEditRole = (id: string, name: string, description: string) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, name, description } : r));
    setIsEditModalOpen(false);
    setRoleToEdit(null);
  };
  
  const openEditModal = (role: Role) => {
    setRoleToEdit(role);
    setIsEditModalOpen(true);
  };
  
  const openDeleteModal = (role: Role) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteRole = () => {
    if (roleToDelete) {
      if (roleToDelete.userCount > 0) {
        alert(`Cannot delete role "${roleToDelete.name}" as it is assigned to ${roleToDelete.userCount} user(s).`);
      } else {
        setRoles(prev => prev.filter(r => r.id !== roleToDelete.id));
        setPermissions(prev => prev.filter(p => p.roleId !== roleToDelete.id));
        if (selectedRoleId === roleToDelete.id) {
          setSelectedRoleId(roles[0]?.id || null);
        }
      }
      setIsDeleteModalOpen(false);
      setRoleToDelete(null);
    }
  };
  
  const handlePermissionChange = (moduleId: string, permissionType: keyof Omit<Permission, 'roleId' | 'moduleId'>, value: boolean) => {
    if (!selectedRoleId) return;
    setPermissions(prev => prev.map(p => 
      (p.roleId === selectedRoleId && p.moduleId === moduleId) 
        ? { ...p, [permissionType]: value } 
        : p
    ));
  };

  return (
    <div>
      <PageHeader title="Access Control Management" subtitle="Define roles and manage fine-grained permissions for each module." />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 xl:col-span-3">
          <RoleList 
            roles={roles}
            selectedRoleId={selectedRoleId}
            onSelectRole={setSelectedRoleId}
            onAddRole={() => setIsAddModalOpen(true)}
            onEditRole={openEditModal}
            onDeleteRole={openDeleteModal}
          />
        </div>
        <div className="lg:col-span-8 xl:col-span-9">
          <RoleDetail
            role={selectedRole}
            modules={modules}
            permissions={permissions.filter(p => p.roleId === selectedRoleId)}
            onPermissionChange={handlePermissionChange}
          />
        </div>
      </div>

      <AddRoleModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddRole}
      />
      
      {roleToEdit && (
        <EditRoleModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={handleEditRole}
          role={roleToEdit}
        />
      )}

      {roleToDelete && (
        <ActionConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDeleteRole}
          title={`Delete Role: ${roleToDelete.name}`}
          message={
            roleToDelete.userCount > 0
              ? `This role is assigned to ${roleToDelete.userCount} user(s). You must reassign them before deleting this role.`
              : "Are you sure you want to permanently delete this role? This action cannot be undone."
          }
        />
      )}
    </div>
  );
};

export default AccessControl;
