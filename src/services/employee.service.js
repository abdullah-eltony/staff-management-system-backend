import pool from "../db.js";
import Employee from "../models/employee.model.js";
import bcrypt from "bcrypt";

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
    const { name, email, role, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO employees (name, email, role , password) VALUES($1, $2, $3, $4) RETURNING *",
      [name, email, role, hashedPassword]
    );
    return new Employee(result.rows[0]);
  }

  static async update(employee_id, data) {
    const { name, email, role, password } = data;
    let result;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      result = await pool.query(
        "UPDATE employees SET name=$1, email=$2, role=$3,password=$5, updated_at=NOW() WHERE employee_id=$4 RETURNING *",
        [name, email, role, employee_id, hashedPassword]
      );
    } else {
      result = await pool.query(
        "UPDATE employees SET name=$1, email=$2, role=$3, updated_at=NOW() WHERE employee_id=$4 RETURNING *",
        [name, email, role, employee_id]
      );
    }

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

export default EmployeeService;
