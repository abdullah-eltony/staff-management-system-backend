// tests/report.test.js
const request = require('supertest');
const app = require('../src/index');
const pool = require('../src/db');

// Mock AI summary for tests
jest.mock('@xenova/transformers', () => ({
  pipeline: async () => async (text) => [{ summary_text: 'mock summary' }],
}));

let employeeId;
let taskId;
let reportId;

beforeAll(async () => {
  const empRes = await pool.query(
    `INSERT INTO employees (name, email, role) VALUES ($1,$2,$3) RETURNING *`,
    ['Test Emp', 'testemp@example.com', 'employee']
  );
  employeeId = empRes.rows[0].employee_id;

  const taskRes = await pool.query(
    `INSERT INTO tasks (title, description, status, assigned_employee_id)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    ['Test Task', 'task for report tests', 'pending', employeeId]
  );
  taskId = taskRes.rows[0].task_id;
});

afterAll(async () => {
  await pool.query(`DELETE FROM reports WHERE title LIKE 'Test Report%'`);
  await pool.query(`DELETE FROM tasks WHERE task_id = $1`, [taskId]);
  await pool.query(`DELETE FROM employees WHERE employee_id = $1`, [employeeId]);
  await pool.end();
});

describe('Report API (CRUD + validation + relations)', () => {
  test('POST /reports - create report', async () => {
    const res = await request(app).post('/reports/create').send({
      task_id: taskId,
      employee_id: employeeId,
      title: 'Test Report Title',
      content: 'This is a test report content please summarization it using AI.',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    reportId = res.body.id;
  });

  test('GET /reports - should return reports with employee & task info', async () => {
    const res = await request(app).get('/reports');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /reports/:report_id - get single report', async () => {
    const res = await request(app).get(`/reports/${reportId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', reportId);
    expect(res.body).toHaveProperty('employee_id', employeeId);
    expect(res.body).toHaveProperty('task_id', taskId);
  });

  test('DELETE /reports/:report_id - delete report', async () => {
    const res = await request(app).delete(`/reports/${reportId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Report deleted');
  });
});
