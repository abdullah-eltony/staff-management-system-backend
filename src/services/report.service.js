// services/reportService.js
import pool from "../db.js";
import Report from "../models/report.model.js";

class ReportService {
  static async create({ task_id, title, content, ai_summary }) {
    const result = await pool.query(
      `INSERT INTO reports (task_id, title, content, ai_summary)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [task_id, title, content, ai_summary]
    );
    return new Report(result.rows[0]);
  }

  static async getAll({ employee_id, role }) {
    let result;

    if (role !== "admin" && role !== "manager") {
      // Regular employees can only see their own reports
      result = await pool.query(
        `SELECT r.id, r.title, r.created_at, t.title AS task_title
       FROM reports r
       JOIN tasks t ON r.task_id = t.task_id
       WHERE t.assigned_employee_id = $1
       ORDER BY r.created_at DESC`,
        [employee_id]
      );
    } else {
      // Admins can see all reports
      result = await pool.query(
        `SELECT r.id, r.title, r.created_at, e.name AS employee_name, t.title AS task_title
       FROM reports r
       JOIN tasks t ON r.task_id = t.task_id
       JOIN employees e ON t.assigned_employee_id = e.employee_id
       ORDER BY r.created_at DESC`
      );
    }

    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(
      `
      SELECT
        r.*,
        t.title AS task_title,
        e.name AS employee_name
      FROM reports r
      JOIN tasks t ON r.task_id = t.task_id
      JOIN employees e ON t.assigned_employee_id = e.employee_id
      WHERE r.id = $1
      `,
      [id]
    );
    if (!result.rows[0]) return null;
    return result.rows[0];
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
