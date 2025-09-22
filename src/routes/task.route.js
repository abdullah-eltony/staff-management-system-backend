const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/task.controller");
const authApiKey = require("../middlewares/authApiKey");

router.post("/add",authApiKey, TaskController.createTask);
router.get("/", TaskController.getAllTasks);
router.get("/employee/:employee_id", TaskController.getTasksByEmployee);
router.get("/:task_id", TaskController.getTaskById);
router.put("/:task_id",authApiKey, TaskController.updateTask);
router.delete("/:task_id",authApiKey, TaskController.deleteTask);

module.exports = router;