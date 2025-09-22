const request = require("supertest");
const express = require("express");
const pool = require("../src/db");
const authApiKey = require("../src/middlewares/authApiKey");

// Mock app
const app = express();
app.use(express.json());

// Setup test API key
const TEST_API_KEY = "test-api-key";
let intern_id;

// Protected route
app.get("/protected", authApiKey, (req, res) => {
  intern_id = req.user.intern_id;
  res.status(200).json({ message: `Hello User ${intern_id}` });
});



afterAll(async () => {
  await pool.end();
});

describe("API Key Authentication & Logging", () => {
  test("should return 401 if API key is missing", async () => {
    const res = await request(app).get("/protected");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("API key missing");
  });

  test("should return 401 if API key is invalid", async () => {
    const res = await request(app)
      .get("/protected")
      .set("x-api-key", "invalid-key");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid API key");
  });

  test("should allow access and log request if API key is valid", async () => {
    const res = await request(app)
      .get("/protected")
      .set("x-api-key", TEST_API_KEY);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(`Hello User ${intern_id}`);

    // Verify logging
    const logRes = await pool.query(
      "SELECT * FROM api_logs WHERE intern_id = $1 AND endpoint = $2 ORDER BY created_at DESC LIMIT 1",
      [1, "/protected"]
    );
    expect(logRes.rows.length).toBeGreaterThan(0);
    expect(logRes.rows[0].method).toBe("GET");
  });
});
