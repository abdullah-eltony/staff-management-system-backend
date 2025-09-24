
import EmployeeService from '../services/employee.service.js';
import { createEmployeeSchema, updateEmployeeSchema } from '../validator/employeeValidator.js';

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await EmployeeService.getAll();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await EmployeeService.getById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    // validate input data
    const { error } = createEmployeeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const employee = await EmployeeService.create(req.body);
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err)
  }
};

export const updateEmployee = async (req, res) => {
  try {
    // validate input data
    const { error } = updateEmployeeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const employee = await EmployeeService.update(
      req.params.id,
      req.body
    );
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const deleted = await EmployeeService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }[]
};
