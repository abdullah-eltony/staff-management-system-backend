// مجرد تمثيل الهيكل فقط
class Employee {
  constructor({ employee_id, name, email, role }) {
    this.employee_id = employee_id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
}

module.exports = Employee;
