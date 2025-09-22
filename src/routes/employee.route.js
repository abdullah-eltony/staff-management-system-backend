const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const authApiKey = require('../middlewares/authApiKey');

router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/add',authApiKey, employeeController.createEmployee);
router.put('/:id',authApiKey, employeeController.updateEmployee);
router.delete('/:id',authApiKey, employeeController.deleteEmployee);

module.exports = router;
