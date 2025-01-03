const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');

const ROLES_LIST = require('../../config/roles_list');

const verifyRoles = require('../../middleware/verifyRoles');

// Chaining HTTP methods together under the same route (for just the slash)
router.route('/')
    .get(employeesController.getAlEmployees)  // Calls verify first before going to getAllEmployees
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);  // Only admins can delete employees

// Get request that has a parameter for id
router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;