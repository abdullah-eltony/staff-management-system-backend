class Task {
  constructor({ task_id, title, description, status, assigned_employee_id, created_at, updated_at }) {
    this.task_id = task_id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.assigned_employee_id = assigned_employee_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

export default Task;
