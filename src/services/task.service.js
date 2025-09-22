const pool = require("../db");
const Task = require("../models/task.model");

class TaskService {
  static async getAll() {
  const result = await pool.query(`
    SELECT t.*, e.email AS employee_email
    FROM tasks t
    LEFT JOIN employees e
    ON t.assigned_employee_id = e.employee_id
  `);
  return result.rows;
}

  static async getTasksByEmployee(employee_id) {
    const result = await pool.query(
      `SELECT * FROM tasks WHERE assigned_employee_id = $1`,
      [employee_id]
    );
    return result.rows.map((row) => new Task(row));
  }

  static async getById(task_id) {
    const result = await pool.query("SELECT * FROM tasks WHERE task_id=$1", [
      task_id,
    ]);
    if (result.rows.length === 0) return null;
    return new Task(result.rows[0]);
  }

  static async create(data) {
    const { title, description, status, assigned_employee_id } = data;
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, assigned_employee_id)
       VALUES($1,$2,$3,$4) RETURNING *`,
      [title, description, status, assigned_employee_id]
    );
    return new Task(result.rows[0]);
  }

  static async update(task_id, data) {
    const { title, description, status, assigned_employee_id } = data;
    const result = await pool.query(
      `UPDATE tasks
       SET title=$1, description=$2, status=$3, assigned_employee_id=$4, updated_at=NOW()
       WHERE task_id=$5 RETURNING *`,
      [title, description, status, assigned_employee_id, task_id]
    );
    if (result.rows.length === 0) return null;
    return new Task(result.rows[0]);
  }

  static async delete(task_id) {
    const result = await pool.query(
      "DELETE FROM tasks WHERE task_id=$1 RETURNING *",
      [task_id]
    );
    return result.rows.length > 0;
  }
}

module.exports = TaskService;
