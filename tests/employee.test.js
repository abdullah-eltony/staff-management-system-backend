const request = require("supertest");
const pool = require("../src/db");
const express = require("express");
const authApiKey = require("../src/middlewares/authApiKey");

// Mock app
const app = express();
app.use(express.json());
app.use("/employees", authApiKey, require("../src/routes/employee.route"));

afterAll(async () => {
  await pool.end();
});

// Test suite for Employee API
describe("Employee API", () => {
  let employeeId;

  test("POST /employees - create employee", async () => {
    const response = await request(app)
      .post("/employees/add")
      .set("x-api-key", "test-api-key")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        role: "employee",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("employee_id");
    employeeId = response.body.employee_id;
  });

  test("GET /employees - get all employees", async () => {
    const response = await request(app)
      .get("/employees")
      .set("x-api-key", "test-api-key");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /employees/:employee_id - get employee by id", async () => {
    const response = await request(app)
    .get(`/employees/${employeeId}`)
    .set("x-api-key", "test-api-key");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("employee_id", employeeId);
  });

  test("PUT /employees/:employee_id - update employee", async () => {
    const response = await request(app).put(`/employees/${employeeId}`)
    .set("x-api-key", "test-api-key")
    .send({
      name: "Updated User",
      email: "updated@example.com",
      role: "employee",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("name", "Updated User");
  });

  test("DELETE /employees/:employee_id - delete employee", async () => {
    const response = await request(app).delete(`/employees/${employeeId}`)
    .set("x-api-key", "test-api-key");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Employee deleted successfully"
    );
  });
});

// Test suite for Employee input validation
describe("Employee Input Validation", () => {
  test("POST /employees - invalid email", async () => {
    const response = await request(app).post("/employees/add")
    .set("x-api-key", "test-api-key")
    .send({
      name: "Invalid Email User",
      email: "invalid-email",
      role: "employee",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
