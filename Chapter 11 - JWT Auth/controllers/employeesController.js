// Create data object to contain employee data and setter 
const data = {
    employees: require('../model/employees.json'),
    setEmployees: function (data) { this.employees = data }
};

// Returns entire JSON file of employees on GET request
const getAlEmployees = (req, res) => {
    res.json(data.employees);
}

// Returns employee ID that is passed in
const getEmployee = (req, res) => {
    // Grab employee with given ID (if one is given)
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));

    // If no employee is found with given ID, give an error
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.params.id} not found.` });
    }

    // Return JSON data of employee with requested ID
    res.json(employee);
}

// Returns firstname and lastname on POST request
const createNewEmployee = (req, res) => {
    // Create object containing the passed-in data for the new employee
    const newEmployee = {
        id: data.employees[data.employees.length - 1].id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }

    // If a first or last name is not provided, give an error
    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ 'message': 'First and last names are required.' });
    }

    // Append new employee to end of array and set the employees
    data.setEmployees([...data.employees, newEmployee]);

    // Return newly updated JSON data and a status code for created new record
    res.status(201).json(data.employees);
}

// Return firstname and lastname back on PUT request
const updateEmployee = (req, res) => {
    // Grab employee with given ID (if one is given)
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));

    // If ID is not provided, give an error
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found.` });
    }

    // If PUT request contains new first or last name, update them for the employee with ID
    if (req.body.firstname) employee.firstname = req.body.firstname;
    if (req.body.lastname) employee.lastname = req.body.lastname;

    // Get array and remove the employee with the current existing ID
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));

    // Create new array and append the newly updated employee at the end
    const unsortedArray = [...filteredArray, employee];

    // Set employee JSON data to be updated array sorted by ID column
    // If ID is greater, return 1, else if less than, return -1, else return 0 (when even)
    data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));

    // Return the newly updated JSON data
    res.json(data.employees);
}

// Return ID back on DELETE request
const deleteEmployee = (req, res) => {
    // Grab employee with given ID (if one is given)
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));

    // If ID is not provided, give an error
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found.` });
    }

    // Get array and remove the employee with the given ID
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));

    // Set employee JSON data to be the same just without the removed employee
    data.setEmployees([...filteredArray]);

    // Return the newly updated JSON data
    res.json(data.employees);
}

// Export all created functions
module.exports = {
    getAlEmployees,
    getEmployee,
    createNewEmployee,
    updateEmployee,
    deleteEmployee
}