const express = require('express');
const router = express.Router();
const path = require('path');

// Create object to store employee data
const data = {};

// Set data's employees attribute to json data of employees
data.employees = require('../../data/employees.json');

// Chaining HTTP methods together under the same route (for just the slash)
router.route('/')
    .get((req, res) => {  // Return entire JSON file on get request
        res.json(data.employees)
    })
    .post((req, res) => {  // Return firstname and lastname on post request
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        });
    })
    .put((req, res) => {  // Return firstname and lastname back on put request
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        });
    })
    .delete((req, res) => {  // Return ID back on delete request
        res.json({ "id": req.body.id });
    });

// Get request that has a parameter for id
router.route('/:id')
    .get((req, res) => {  // Returns employee ID that is passed in
        res.json({ "id": req.params.id });
    });

module.exports = router;