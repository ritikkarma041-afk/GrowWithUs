const router = require('express').Router();
const RolesAndPermissionsController = require('../controllers/rolesAndPermission.controller');
const { check } = require('../common/middlewares/IsAuthenticated');
const { has } = require('../common/middlewares/CheckPermission');

// Routes for roles and permissions
router.get('/roles', check, RolesAndPermissionsController.getAllRoles);
// router.post('/roles', check, has('ADMIN'), RolesAndPermissionsController.createRole);
router.post('/roles', check, RolesAndPermissionsController.createRole);
router.get('/roles/:roleId/permissions', check, RolesAndPermissionsController.getPermissionsForRole);
// router.post('/roles/:roleId/permissions', check, has('ADMIN'), RolesAndPermissionsController.assignPermissionToRole);
router.post('/roles/:roleId/permissions', check, RolesAndPermissionsController.assignPermissionToRole);
// router.delete('/roles/:roleId/permissions', check, has('ADMIN'), RolesAndPermissionsController.removePermissionFromRole);
router.delete('/roles/:roleId/permissions', check, RolesAndPermissionsController.removePermissionFromRole);

router.get('/permissions', check, RolesAndPermissionsController.getAllPermissions);
// router.post('/permissions', check, has('ADMIN'), RolesAndPermissionsController.createPermission);
router.post('/permissions', check, RolesAndPermissionsController.createPermission);

// router.post('/assign-role', check, has('ADMIN'), RolesAndPermissionsController.assignRoleToUser);
router.post('/assign-role', check, RolesAndPermissionsController.assignRoleToUser);
// router.delete('/remove-role', check, has('ADMIN'), RolesAndPermissionsController.removeRoleFromUser);
router.delete('/remove-role', check, RolesAndPermissionsController.removeRoleFromUser);

router.get('/user-roles-permissions', check, RolesAndPermissionsController.getUserRoleAndPermission);

module.exports = router;