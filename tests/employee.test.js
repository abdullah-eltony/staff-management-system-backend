import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';   // ✅ خليها من bcrypt الرسمي
import app from '../src/index.js';
import pool from '../src/db.js';

describe('Employee API', () => {
  let employeeId;
  let token;

  beforeAll(async () => {
    // clean up the employees table
    await pool.query('TRUNCATE employees RESTART IDENTITY CASCADE');

    // add admin user for login
    const hashedPassword = await bcrypt.hash('abdo.com', 10);
    await pool.query(
      `INSERT INTO employees (name, email, role, password)
       VALUES ($1, $2, $3, $4)`,
      ['Abdullah', 'abdullaheltony@gmail.com', 'admin', hashedPassword]
    );

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

  it('should return unauthorized when no token', async () => {
    const res = await request(app)
      .post('/employees/add')
      .set('x-api-key', 'test-api-key')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
        password: 'password123'
      });

    expect(res.statusCode).toBe(401);
  });

  it('should create a new employee', async () => {
    const res = await request(app)
      .post('/employees/add')
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key')
      .send({
        name: 'Test User2',
        email: 'test2@example.com',
        role: 'admin',
        password: 'test2.com'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('employee_id');
    employeeId = res.body.employee_id;
  });

  it('should get all employees', async () => {
    const res = await request(app)
      .get('/employees')
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get employee by ID', async () => {
    const res = await request(app)
      .get(`/employees/${employeeId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('employee_id', employeeId);
    expect(res.body).toHaveProperty('email', 'test2@example.com');
    expect(res.body).toHaveProperty('name', 'Test User2');
  });

  it('should update an employee', async () => {
    const res = await request(app)
      .put(`/employees/${employeeId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key')
      .send({
        name: 'Updated User',
        email: 'updated@example.com',
        role: 'admin',
        password: 'updated.com'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('employee_id', employeeId);
    expect(res.body).toHaveProperty('email', 'updated@example.com');
    expect(res.body).toHaveProperty('name', 'Updated User');
  });

  it('should delete an employee', async () => {
    const res = await request(app)
      .delete(`/employees/${employeeId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key');

    expect(res.statusCode).toBe(204);
  });

  it('should return 404 when getting deleted employee', async () => {
    const res = await request(app)
      .get(`/employees/${employeeId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'test-api-key');

    expect(res.statusCode).toBe(404);
  });
});
