import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller.js";
import authApiKey from "../middlewares/authApiKey.js";
const employeeRouter = express.Router();

// get all employees
employeeRouter.get("/", authApiKey, getAllEmployees);

// get employee by ID
employeeRouter.get("/:id", authApiKey, getEmployeeById);

// create new employee
employeeRouter.post("/add", authApiKey, createEmployee);

// update employee by ID
employeeRouter.put("/:id", authApiKey, updateEmployee);

// delete employee by ID
employeeRouter.delete("/:id", authApiKey, deleteEmployee);

export default employeeRouter;
