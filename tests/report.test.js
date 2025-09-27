// tests/report.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/index.js';
import pool from '../src/db.js';

describe('Report API', () => {
  let token;
  let taskId;
  let reportId;

  beforeAll(async () => {
    // clean up the database
    await pool.query('TRUNCATE reports RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE tasks RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE employees RESTART IDENTITY CASCADE');

    // create admin user
    const hashedPassword = await bcrypt.hash('abdo.com', 10);
    await pool.query(
      `INSERT INTO employees (name, email, role, password)
       VALUES ($1, $2, $3, $4)`,
      ['Abdullah', 'abdullaheltony@gmail.com', 'admin', hashedPassword]
    );

    // Login and save the token
    const loginRes = await request(app)
      .post('/login')
      .send({ email: 'abdullaheltony@gmail.com', password: 'abdo.com' });
    expect(loginRes.statusCode).toBe(200);
    token = loginRes.body.token;

    // create task to link reports to it
    const taskRes = await request(app)
      .post('/tasks/add')
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key')
      .send({
        title: 'Test Task',
        description: 'Task for report testing',
        status: 'pending',
        assigned_employee_id: 1
      });
    expect(taskRes.statusCode).toBe(201);
    taskId = taskRes.body.task_id;
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should create a new report', async () => {
    const res = await request(app)
      .post('/reports/create')
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key')
      .send({
        task_id: taskId,
        title: 'Report 1',
        content: 'This is a test report content and it is quite detailed, more than fifty characters. It should be enough to pass the validation, hopefully.',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    reportId = res.body.id;
  });

  it('should get all reports', async () => {
    const res = await request(app)
      .get('/reports')
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get report by ID', async () => {
    const res = await request(app)
      .get(`/reports/${reportId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', reportId);
    expect(res.body).toHaveProperty('title', 'Report 1');
  });

  it('should delete a report', async () => {
    const res = await request(app)
      .delete(`/reports/${reportId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key');

    expect(res.statusCode).toBe(200);
  });

  it('should return 404 when getting deleted report', async () => {
    const res = await request(app)
      .delete(`/reports/${reportId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key');

    expect(res.statusCode).toBe(404);
  });
});
