const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const authApiKey = require('../middlewares/authApiKey');

// get all employees
router.get('/',authApiKey, employeeController.getAllEmployees);

// get employee by ID
router.get('/:id',authApiKey, employeeController.getEmployeeById);

// create new employee
router.post('/add',authApiKey, employeeController.createEmployee);

// update employee by ID
router.put('/:id',authApiKey, employeeController.updateEmployee);

// delete employee by ID
router.delete('/:id',authApiKey, employeeController.deleteEmployee);

module.exports = router;
