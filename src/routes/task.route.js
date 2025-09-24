
import express from 'express';
import TaskController from '../controllers/task.controller.js';
import authApiKey from '../middlewares/authApiKey.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
const taskRouter = express.Router();

// add new task 
taskRouter.post("/add",authMiddleware,authorizeRoles("admin"), TaskController.createTask);

// get all tasks
taskRouter.get("/",authMiddleware, TaskController.getAllTasks);

// get tasks by employee ID
taskRouter.get("/employee/:employee_id",authMiddleware,authorizeRoles("admin"), TaskController.getTasksByEmployee);

// get task by ID
taskRouter.get("/:task_id",authMiddleware, TaskController.getTaskById);

// update task by ID
taskRouter.put("/:task_id",authMiddleware,authorizeRoles("admin"), TaskController.updateTask);

// delete task by ID
taskRouter.delete("/:task_id",authMiddleware,authorizeRoles("admin"), TaskController.deleteTask);

export default taskRouter;