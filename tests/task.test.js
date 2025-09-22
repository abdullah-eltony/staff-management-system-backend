const request = require("supertest");
const app = require("../src/index");
const pool = require("../src/db");

afterAll(async () => {
  await pool.end();
});

// test api
describe("Task API", () => {
  let taskId;
  let employeeId = 5;

  // CREATE
  test("POST /tasks/add - create task", async () => {
    const response = await request(app).post("/tasks/add").send({
      title: "Test Task",
      description: "Testing task API",
      status: "pending",
      assigned_employee_id: employeeId,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("task_id");
    taskId = response.body.task_id;
  });

  // GET all tasks
  test("GET /tasks - get all tasks", async () => {
    const response = await request(app).get("/tasks");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // GET task by ID
  test("GET /tasks/:task_id - get task by id", async () => {
    const response = await request(app).get(`/tasks/${taskId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("task_id", taskId);
  });

  // GET tasks by employee
  test("GET /tasks/employee/:employee_id - get tasks for employee", async () => {
    const response = await request(app).get(`/tasks/employee/${employeeId}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((task) => {
      expect(task.assigned_employee_id).toBe(employeeId);
    });
  });

  // UPDATE task
  test("PUT /tasks/:task_id - update task", async () => {
    const response = await request(app).put(`/tasks/${taskId}`).send({
      title: "Updated Task",
      description: "Updated description",
      status: "in_progress",
      assigned_employee_id: employeeId,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("title", "Updated Task");
    expect(response.body).toHaveProperty("status", "in_progress");
  });

  // DELETE task
  test("DELETE /tasks/:task_id - delete task", async () => {
    const response = await request(app).delete(`/tasks/${taskId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Task deleted successfully"
    );
  });
});

// Test invalid task creation
describe("Task API - Validation", () => {
  test("POST /tasks/add - fail to create task with invalid status", async () => {
    const response = await request(app).post("/tasks/add").send({
      title: "Invalid Task",
      description: "This should fail",
      status: "unknown_status",
      assigned_employee_id: 1,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
