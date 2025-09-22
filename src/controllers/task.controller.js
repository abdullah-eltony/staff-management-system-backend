const TaskService = require("../services/task.service");
const { createTaskSchema, updateTaskSchema } = require("../validator/taskValidator");

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskService.getAll();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTasksByEmployee = async (req, res) => {
  try {
    const tasks = await TaskService.getTasksByEmployee(req.params.employee_id);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await TaskService.getById(req.params.task_id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { error } = createTaskSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const task = await TaskService.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { error } = updateTaskSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const task = await TaskService.update(req.params.task_id, req.body);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deleted = await TaskService.delete(req.params.task_id);
    if (!deleted) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
