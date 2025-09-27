import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/index.js';
import pool from '../src/db.js';

describe('Task API', () => {
  let token;
  let employeeId;
  let taskId;

  beforeAll(async () => {
    // clean up the database
    await pool.query('TRUNCATE tasks RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE employees RESTART IDENTITY CASCADE');

    // create admin user for testing
    const hashedPassword = await bcrypt.hash('abdo.com', 10);
    const empRes = await pool.query(
      `INSERT INTO employees (name, email, role, password)
       VALUES ($1, $2, $3, $4) RETURNING employee_id`,
      ['Abdullah', 'abdullaheltony@gmail.com', 'admin', hashedPassword]
    );
    employeeId = empRes.rows[0].employee_id;

    // login and save the token
    const res = await request(app)
      .post('/login')
      .send({
        email: 'abdullaheltony@gmail.com',
        password: 'abdo.com'
      });

    expect(res.statusCode).toBe(200);
    token = res.body.token;
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/tasks/add')
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key')
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        status: 'pending',
        assigned_employee_id: employeeId
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('task_id');
    taskId = res.body.task_id;
  });

  it('should get all tasks', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get task by ID', async () => {
    const res = await request(app)
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('task_id', taskId);
    expect(res.body).toHaveProperty('title', 'Test Task');
  });

  it('should update a task', async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key')
      .send({
        title: 'Updated Task',
        description: 'Updated description',
        status: 'completed',
        assigned_employee_id: employeeId
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('task_id', taskId);
    expect(res.body).toHaveProperty('title', 'Updated Task');
    expect(res.body).toHaveProperty('status', 'completed');
  });

  it('should delete a task', async () => {
    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key');

    expect(res.statusCode).toBe(204);
  });

  it('should return 404 when getting deleted task', async () => {
    const res = await request(app)
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key');

    expect(res.statusCode).toBe(404);
  });
});
