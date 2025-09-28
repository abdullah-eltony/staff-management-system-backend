
import express from 'express';
import TaskController from '../controllers/task.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import apiKeyLogger from '../middlewares/apiKeyLogger.js';
const taskRouter = express.Router();

// add new task 
taskRouter.post("/add",apiKeyLogger,authMiddleware, authorizeRoles("admin","manager"), TaskController.createTask);

// get all tasks
taskRouter.get("/",apiKeyLogger,authMiddleware, TaskController.getAllTasks);

// get tasks by employee ID
taskRouter.get("/employee/:employee_id",apiKeyLogger, authMiddleware,authorizeRoles("admin","manager"), TaskController.getTasksByEmployee);

// get task by ID
taskRouter.get("/:task_id",apiKeyLogger, authMiddleware, TaskController.getTaskById);

// update task by ID
taskRouter.put("/:task_id",apiKeyLogger, authMiddleware, authorizeRoles("admin","manager"), TaskController.updateTask);

// change task status
taskRouter.patch("/:task_id", apiKeyLogger, authMiddleware, TaskController.changeTaskStatus);

// delete task by ID
taskRouter.delete("/:task_id",apiKeyLogger, authMiddleware,authorizeRoles("admin","manager"), TaskController.deleteTask);

export default taskRouter;