const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');



// Chaining HTTP methods together under the same route (for just the slash)
router.route('/')
    .get(employeesController.getAlEmployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

// Get request that has a parameter for id
router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;