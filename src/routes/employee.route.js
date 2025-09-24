import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller.js";
import authApiKey from "../middlewares/authApiKey.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
const employeeRouter = express.Router();

// get all employees
employeeRouter.get("/", authMiddleware, getAllEmployees);

// get employee by ID
employeeRouter.get("/:id", getEmployeeById);

// create new employee
employeeRouter.post("/add", authMiddleware, authorizeRoles('admin'), createEmployee);

// update employee by ID
employeeRouter.put("/:id", authMiddleware, authorizeRoles('admin'),updateEmployee);

// delete employee by ID
employeeRouter.delete("/:id",authMiddleware, authorizeRoles('admin'), deleteEmployee);

export default employeeRouter;
