const request = require("supertest");
const app = require("../src/index");
const pool = require("../src/db");

afterAll(async () => {
  await pool.end();
});

// Test suite for Employee API
describe("Employee API", () => {
  let employeeId;

  test("POST /employees - create employee", async () => {
    const response = await request(app).post("/employees/add").send({
      name: "Test User",
      email: "testuser@example.com",
      role: "employee",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("employee_id");
    employeeId = response.body.employee_id;
  });

  test("GET /employees - get all employees", async () => {
    const response = await request(app).get("/employees");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /employees/:employee_id - get employee by id", async () => {
    const response = await request(app).get(`/employees/${employeeId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("employee_id", employeeId);
  });

  test("PUT /employees/:employee_id - update employee", async () => {
    const response = await request(app).put(`/employees/${employeeId}`).send({
      name: "Updated User",
      email: "updated@example.com",
      role: "employee",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("name", "Updated User");
  });

  test("DELETE /employees/:employee_id - delete employee", async () => {
    const response = await request(app).delete(`/employees/${employeeId}`);
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
    const response = await request(app).post("/employees/add").send({
      name: "Invalid Email User",
      email: "invalid-email",
      role: "employee",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  
});
