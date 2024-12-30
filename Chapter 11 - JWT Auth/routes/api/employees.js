const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');
const verifyJWT = require('../../middleware/verifyJWT');

// Chaining HTTP methods together under the same route (for just the slash)
router.route('/')
    .get(verifyJWT, employeesController.getAlEmployees)  // Calls verify first before going to getAllEmployees
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

// Get request that has a parameter for id
router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;