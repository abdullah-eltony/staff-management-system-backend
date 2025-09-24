
import express from 'express';
import TaskController from '../controllers/task.controller.js';
import authApiKey from '../middlewares/authApiKey.js';
const taskRouter = express.Router();

// add new task 
taskRouter.post("/add",authApiKey, TaskController.createTask);

// get all tasks
taskRouter.get("/",authApiKey, TaskController.getAllTasks);

// get tasks by employee ID
taskRouter.get("/employee/:employee_id",authApiKey, TaskController.getTasksByEmployee);

// get task by ID
taskRouter.get("/:task_id",authApiKey, TaskController.getTaskById);

// update task by ID
taskRouter.put("/:task_id",authApiKey, TaskController.updateTask);

// delete task by ID
taskRouter.delete("/:task_id",authApiKey, TaskController.deleteTask);

export default taskRouter;