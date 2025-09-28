import pool from "../db.js";
import Task from "../models/task.model.js";

class TaskService {
  static async getAll({ employee_id, role }) {
    let result;
    if (role !== "admin" && role !== "manager") {
      result = await pool.query(
        `
      SELECT t.*, e.email AS employee_email
      FROM tasks t
      JOIN employees e
      ON t.assigned_employee_id = e.employee_id
      WHERE e.employee_id = $1
      `,
        [employee_id]
      );
    } else {
      result = await pool.query(`
    SELECT t.*, e.email AS employee_email
    FROM tasks t
    LEFT JOIN employees e
    ON t.assigned_employee_id = e.employee_id
  `);
    }

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
    const result = await pool.query(
      `SELECT 
      t.*,
      e.employee_id AS assigned_employee_id, e.name AS employee_name, e.email AS employee_email, e.role AS employee_role
      FROM employees e
      RIGHT JOIN tasks t ON e.employee_id = t.assigned_employee_id
      WHERE t.task_id = $1 `,
      [task_id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  static async create(data) {
    const { title, description, assigned_employee_id } = data;
    await checkEmployeeExists(assigned_employee_id);
    await pool.query(
      `INSERT INTO tasks (title, description, assigned_employee_id)
       VALUES($1,$2,$3) RETURNING *`,
      [title, description, assigned_employee_id]
    );
  }

  static async update(task_id, data) {
    const { title, description, status, assigned_employee_id } = data;

    // Check if the assigned employee exists
    await checkEmployeeExists(assigned_employee_id);
    const result = await pool.query(
      `UPDATE tasks
       SET title=$1, description=$2, status=$3, assigned_employee_id=$4, updated_at=NOW()
       WHERE task_id=$5 RETURNING *`,
      [title, description, status, assigned_employee_id, task_id]
    );
    if (result.rows.length === 0) return null;
    return new Task(result.rows[0]);
  }

  static async updateStatus(task_id, status) {
   await pool.query(
      `UPDATE tasks
       SET status=$1, updated_at=NOW()
       WHERE task_id=$2 RETURNING *`,
      [status, task_id]
    );

  }

  static async delete(task_id) {
    const result = await pool.query(
      "DELETE FROM tasks WHERE task_id=$1 RETURNING *",
      [task_id]
    );
    return result.rows.length > 0;
  }
}

//  Helper function to check if an employee exists
async function checkEmployeeExists(employeeId) {
  const result = await pool.query(
    `SELECT employee_id FROM employees WHERE employee_id = $1`,
    [employeeId]
  );

  if (result.rows.length === 0) {
    const error = new Error(`Employee with id ${employeeId} does not exist`);
    error.status = 404;
    throw error;
  }

  return true;
}

export default TaskService;
