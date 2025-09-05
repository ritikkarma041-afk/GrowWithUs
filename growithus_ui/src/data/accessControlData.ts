import { faker } from '@faker-js/faker';

export interface Module {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
}

export interface Permission {
  roleId: string;
  moduleId: string;
  canRead: boolean;
  canWrite: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export const initialModules: Module[] = [
  { id: 'dashboard', name: 'Dashboard', description: 'View main dashboard analytics.' },
  { id: 'users', name: 'User Management', description: 'Add, edit, and view user profiles.' },
  { id: 'userRoles', name: 'User Roles', description: 'Assign roles to specific users.' },
  { id: 'accessControl', name: 'Access Control', description: 'Manage roles and their permissions.' },
  { id: 'investments', name: 'Investments', description: 'Manage investment records and trades.' },
  { id: 'reports', name: 'Reports', description: 'Generate and view platform reports.' },
  { id: 'email', name: 'Email', description: 'Send emails to users.' },
  { id: 'settings', name: 'Admin Settings', description: 'Configure platform-wide settings.' },
];

export const initialRoles: Role[] = [
  { id: 'admin', name: 'Administrator', description: 'Has full access to all system features.', userCount: 2 },
  { id: 'manager', name: 'Manager', description: 'Can manage users and view reports.', userCount: 5 },
  { id: 'staff', name: 'Staff', description: 'Can view user data but cannot make changes.', userCount: 12 },
  { id: 'client', name: 'Client', description: 'Standard user role with limited access.', userCount: 2847 },
  { id: 'auditor', name: 'Auditor', description: 'Read-only access for auditing purposes.', userCount: 3 },
];

export const initialPermissions: Permission[] = [
  // Admin permissions (full access)
  ...initialModules.map(module => ({
    roleId: 'admin',
    moduleId: module.id,
    canRead: true,
    canWrite: true,
    canUpdate: true,
    canDelete: true,
  })),

  // Manager permissions
  { roleId: 'manager', moduleId: 'dashboard', canRead: true, canWrite: false, canUpdate: false, canDelete: false },
  { roleId: 'manager', moduleId: 'users', canRead: true, canWrite: true, canUpdate: true, canDelete: false },
  { roleId: 'manager', moduleId: 'userRoles', canRead: true, canWrite: true, canUpdate: true, canDelete: false },
  { roleId: 'manager', moduleId: 'accessControl', canRead: false, canWrite: false, canUpdate: false, canDelete: false },
  { roleId: 'manager', moduleId: 'investments', canRead: true, canWrite: false, canUpdate: false, canDelete: false },
  { roleId: 'manager', moduleId: 'reports', canRead: true, canWrite: false, canUpdate: false, canDelete: false },
  { roleId: 'manager', moduleId: 'email', canRead: true, canWrite: true, canUpdate: false, canDelete: false },
  { roleId: 'manager', moduleId: 'settings', canRead: true, canWrite: false, canUpdate: false, canDelete: false },
  
  // Staff permissions
  ...initialModules.map(module => ({
    roleId: 'staff',
    moduleId: module.id,
    canRead: ['dashboard', 'users', 'investments'].includes(module.id),
    canWrite: false,
    canUpdate: false,
    canDelete: false,
  })),

  // Auditor permissions
  ...initialModules.map(module => ({
    roleId: 'auditor',
    moduleId: module.id,
    canRead: true,
    canWrite: false,
    canUpdate: false,
    canDelete: false,
  })),
  
  // Client permissions (no admin access)
  ...initialModules.map(module => ({
    roleId: 'client',
    moduleId: module.id,
    canRead: false,
    canWrite: false,
    canUpdate: false,
    canDelete: false,
  })),
];
