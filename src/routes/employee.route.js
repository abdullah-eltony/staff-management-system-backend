import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller.js";
import apiKeyLogger from "../middlewares/apiKeyLogger.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
const employeeRouter = express.Router();

// get all employees
employeeRouter.get("/",apiKeyLogger, authMiddleware, getAllEmployees);

// get employee by ID
employeeRouter.get("/:id",apiKeyLogger, getEmployeeById);

// create new employee
employeeRouter.post("/add",apiKeyLogger, authMiddleware, authorizeRoles('admin','manager'), createEmployee);

// update employee by ID
employeeRouter.put("/:id",apiKeyLogger, authMiddleware,authorizeRoles('admin','manager'), updateEmployee);

// delete employee by ID
employeeRouter.delete("/:id",authMiddleware, authorizeRoles('admin','manager'), deleteEmployee);

export default employeeRouter;
