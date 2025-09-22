const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/task.controller");
const authApiKey = require("../middlewares/authApiKey");

// add new task 
router.post("/add",authApiKey, TaskController.createTask);

// get all tasks
router.get("/",authApiKey, TaskController.getAllTasks);

// get tasks by employee ID
router.get("/employee/:employee_id",authApiKey, TaskController.getTasksByEmployee);

// get task by ID
router.get("/:task_id",authApiKey, TaskController.getTaskById);

// update task by ID
router.put("/:task_id",authApiKey, TaskController.updateTask);

// delete task by ID
router.delete("/:task_id",authApiKey, TaskController.deleteTask);

module.exports = router;