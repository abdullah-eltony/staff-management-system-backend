const pool = require("../db");
const Employee = require("../models/employee.model");

class EmployeeService {
  static async getAll() {
    const result = await pool.query("SELECT * FROM employees");
    return result.rows.map((row) => new Employee(row));
  }

  static async getById(id) {
    const result = await pool.query(
      "SELECT * FROM employees WHERE employee_id=$1",
      [id]
    );
    if (result.rows.length === 0) return null;
    return new Employee(result.rows[0]);
  }

  static async create(data) {
    const { name, email, role } = data;
    const result = await pool.query(
      "INSERT INTO employees (name, email, role) VALUES($1, $2, $3) RETURNING *",
      [name, email, role]
    );
    return new Employee(result.rows[0]);
  }

  static async update(employee_id, data) {
    const { name, email, role } = data;
    const result = await pool.query(
      "UPDATE employees SET name=$1, email=$2, role=$3, updated_at=NOW() WHERE employee_id=$4 RETURNING *",
      [name, email, role, employee_id]
    );
    if (result.rows.length === 0) return null;
    return new Employee(result.rows[0]);
  }

  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM employees WHERE employee_id=$1 RETURNING *",
      [id]
    );
    return result.rows.length > 0;
  }
}

module.exports = EmployeeService;
