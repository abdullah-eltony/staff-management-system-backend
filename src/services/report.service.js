// services/reportService.js
import pool from "../db.js";
import Report from "../models/report.model.js";

class ReportService {
  static async create({ task_id, employee_id, title, content, ai_summary }) {
    const result = await pool.query(
      `INSERT INTO reports (task_id, employee_id, title, content, ai_summary)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [task_id, employee_id, title, content, ai_summary]
    );
    return new Report(result.rows[0]);
  }

  static async getAll({ employee_id, role }) {
    let result;
    if (role !== "admin") {
      result = await pool.query(
        `SELECT r.id, r.title, r.created_at, e.name as employee_name, t.title as task_title
     FROM reports r
     JOIN employees e ON r.employee_id = e.employee_id
     JOIN tasks t ON r.task_id = t.task_id
     WHERE e.employee_id = $1
     ORDER BY r.created_at DESC`,
        [employee_id]
      );
    } else {
      result = await pool.query(
        `SELECT r.id, r.title, r.created_at, e.name as employee_name, t.title as task_title
     FROM reports r
     JOIN employees e ON r.employee_id = e.employee_id
     JOIN tasks t ON r.task_id = t.task_id
     ORDER BY r.created_at DESC`
      );
    }

    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(
      `SELECT r.*, e.name as employee_name, t.title as task_title
       FROM reports r
       JOIN employees e ON r.employee_id = e.employee_id
       JOIN tasks t ON r.task_id = t.task_id
       WHERE r.id = $1`,
      [id]
    );
    if (!result.rows[0]) return null;
    return new Report(result.rows[0]);
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM reports WHERE id = $1 RETURNING *`,
      [id]
    );
    if (!result.rows[0]) return null;
    return new Report(result.rows[0]);
  }
}

export default ReportService;
