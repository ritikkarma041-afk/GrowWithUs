const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sequelize = require('../common/database');
const defineRolesAndPermission = require('../common/models/RolePermission');
const defineUserRole = require('../common/models/UserRole');
const UserRole = defineUserRole(sequelize);
const RoleAndPermission = defineRolesAndPermission(sequelize);
const defineRole = require('../common/models/Role');
const Role = defineRole(sequelize);
const definePermission = require('../common/models/Permission');
const Permission = definePermission(sequelize);

const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv();
addFormats(ajv);


exports.getUserRoleAndPermission = async (req, res) => {
    try {
        const userRoles = await UserRole.findAll({ where: { userId: req.user.userId } });

        if (userRoles.length === 0) {
            return res.json({ success: true, data: [] });
        }

        const roleIds = userRoles.map(userRole => userRole.roleId);

        // Fetch roles
        const roles = await Role.findAll({ where: { id: roleIds } });

        // Fetch roles and permissions with permission details
        const rolesAndPermissions = await RoleAndPermission.findAll({
            where: { roleId: roleIds },
            include: [
                {
                    model: Permission,
                    as: 'Permission',
                    attributes: ['id', 'name']
                }
            ]
        });

        // Combine role names with permissions
        const result = roles.map(role => {
            const permissions = rolesAndPermissions
                .filter(rp => rp.roleId === role.id)
                .map(rp => ({
                    permissionId: rp.permissionId,
                    permissionName: rp.Permission.name
                }));
            return {
                roleId: role.id,
                roleName: role.name,
                permissions,
            };
        });

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllRoles = async (req, res) => {
    const roles = await Role.findAll();
    res.json({ success: true, data: roles });
};

// Assign a role to a user
exports.assignRoleToUser = async (req, res) => {
    const { userId, roleId } = req.body;
    const requestUserId = req.user.userId;

    try {
        const userRole = await UserRole.create({ userId, roleId, createdBy: requestUserId });
        res.json({ success: true, data: userRole });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove a role from a user
exports.removeRoleFromUser = async (req, res) => {
    const { userId, roleId } = req.body;
    try {
        const result = await UserRole.destroy({ where: { userId, roleId } });
        if (result) {
            res.json({ success: true, message: 'Role removed from user successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Role not found for the user' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get permissions for a role
exports.getPermissionsForRole = async (req, res) => {
    const { roleId } = req.params;

    try {
        const permissions = await RoleAndPermission.findAll({ where: { roleId } });
        res.json({ success: true, data: permissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Assign a permission to a role
exports.assignPermissionToRole = async (req, res) => {
    const { roleId } = req.params;
    const { permissionId } = req.body;
    const requestUserId = req.user.userId;
    try {
        const rolePermission = await RoleAndPermission.create({ roleId, permissionId, createdBy: requestUserId });
        res.json({ success: true, data: rolePermission });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove a permission from a role
exports.removePermissionFromRole = async (req, res) => {
    const { roleId, permissionId } = req.body;

    try {
        const result = await RoleAndPermission.destroy({ where: { roleId, permissionId } });
        if (result) {
            res.json({ success: true, message: 'Permission removed from role successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Permission not found for the role' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all permissions
exports.getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.findAll();
        res.json({ success: true, data: permissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create permission
exports.createPermission = async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.userId;
    try {
        const permission = await Permission.create({ name, description, createdBy: userId });
        res.json({ success: true, data: permission });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create Roles
exports.createRole = async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.userId;
    try {
        const role = await Role.create({ name, description, createdBy: userId });
        res.json({ success: true, data: role });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};