// Import Employee schema for usage with MongoDB
const Employee = require('../model/Employee');

// Returns all data of employees from MongoDB database on GET request
const getAlEmployees = async (req, res) => {
    // Attempt to grab employees data from database
    const employees = await Employee.find();

    // If no employees are found, then return a 204 error (no content)
    if (!employees) return res.status(204).json({ 'message': 'No employees found.' });

    // If employees data is found, return json formatted version of the data
    res.json(employees);
}

// Returns employee ID that is passed in
const getEmployee = async (req, res) => {
    // If no request, body, or ID, then give bad request error (400)
    if (!req?.params?.id) return res.status(400).json({ 'message': 'ID parameter is required.' });

    // Attempt to grab employee with given ID from MongoDB database
    const employee = await Employee.findOne({ _id: req.params.id }).exec();

    // If employee with ID is not found, give a no content error (204)
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.params.id}.` });
    }

    // Return JSON data of employee with requested ID
    res.json(employee);
}

// Creates a new employee in database when first and last name are given
const createNewEmployee = async (req, res) => {
    // If no request, no body, or no first/last name in body, give bad request error (400)
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ 'message': 'First and last names are required.' });
    }

    try {
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });

        // Return successful status with new Employee's information on successful creation!
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

// Return firstname and lastname back on PUT request
const updateEmployee = async (req, res) => {
    // If missing request, body, or ID, give bad request error (400)
    if (!req?.body?.id) return res.status(400).json({ 'message': 'ID parameter is required.' });

    // Attempt to grab employee with given ID from MongoDB database
    const employee = await Employee.findOne({ _id: req.body.id }).exec();

    // If employee with ID is not found, give a no content error (204)
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }

    // If PUT request contains new first or last name, update them for the employee with ID
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;

    // Save updated employee to database
    const result = await employee.save();

    // Return the newly updated data
    res.json(result);
}

// Return ID back on DELETE request
const deleteEmployee = async (req, res) => {
    // If missing request, body, or ID, give bad request error (400)
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'Employee ID required.' });
    }

    // Attempt to grab employee with given ID from MongoDB database
    const employee = await Employee.findOne({ _id: req.body.id }).exec();

    // If employee with ID is not found, give a no content error (204)
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }

    // If employee exists with given ID, then delete it from database
    const result = await employee.deleteOne({ _id: req.body.id });

    // Return the newly updated data
    res.json(result);
}

// Export all created functions
module.exports = {
    getAlEmployees,
    getEmployee,
    createNewEmployee,
    updateEmployee,
    deleteEmployee
}