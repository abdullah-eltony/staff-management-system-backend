
export default class Report {
  constructor({ id, task_id, employee_id, title, content, ai_summary, status, created_at }) {
    this.id = id;
    this.task_id = task_id;
    this.employee_id = employee_id;
    this.title = title;
    this.content = content;       
    this.ai_summary = ai_summary;
    this.created_at = created_at
  }
}


