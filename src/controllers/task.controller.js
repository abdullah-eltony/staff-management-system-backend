import TaskService from "../services/task.service.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validator/taskValidator.js";

class TaskController {
  static async getAllTasks(req, res, next) {
    try {
      const tasks = await TaskService.getAll(req.user);
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  }

  static async getTasksByEmployee(req, res, next) {
    try {
      const tasks = await TaskService.getTasksByEmployee(
        req.params.employee_id
      );
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  }

  static async getTaskById(req, res, next) {
    try {
      const task = await TaskService.getById(req.params.task_id);
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (err) {
      next(err);
    }
  }

  static async createTask(req, res, next) {
    try {
      const { error } = createTaskSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      await TaskService.create(req.body);
      res.status(201).json({ message: "Task created successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async updateTask(req, res, next) {
    try {
      const { error } = updateTaskSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });
      const task = await TaskService.update(req.params.task_id, req.body);
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (err) {
      next(err);
    }
  }

  static async changeTaskStatus(req, res, next) {
    try {
      const { status } = req.body;
      await TaskService.updateStatus(req.params.task_id, status);
      res.json({ message: "Task status updated successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async deleteTask(req, res, next) {
    try {
      const deleted = await TaskService.delete(req.params.task_id);
      if (!deleted) return res.status(404).json({ error: "Task not found" });
      res.status(204).json({ message: "Task deleted successfully" });
    } catch (err) {

      next(err);
    }
  }
}

export default TaskController;
