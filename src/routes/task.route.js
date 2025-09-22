const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/task.controller");

router.post("/add", TaskController.createTask);
router.get("/", TaskController.getAllTasks);
router.get("/employee/:employee_id", TaskController.getTasksByEmployee);
router.get("/:task_id", TaskController.getTaskById);
router.put("/:task_id", TaskController.updateTask);
router.delete("/:task_id", TaskController.deleteTask);

module.exports = router;