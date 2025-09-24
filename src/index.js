import express from "express";
import cors from "cors";
const app = express();
app.use(express.json());

// Enable CORS for all origins
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);

// Employee Routes
import employeeRouter from "./routes/employee.route.js";
app.use("/employees", employeeRouter);

// Task Routes
import taskRouter from "./routes/task.route.js";
app.use("/tasks", taskRouter);

//Report Routes
import reportRouter from "./routes/report.route.js";
app.use("/reports", reportRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

import pool from"../src/db.js"; // عدل المسار حسب مكان db.js

async function addPasswordColumn() {
  try {
    await pool.query(`
      ALTER TABLE employees
      ADD COLUMN IF NOT EXISTS password VARCHAR(255) NOT NULL ;
    `);

    console.log("✅ Password column added successfully to employees table.");
  } catch (err) {
    console.error("❌ Error adding password column:", err);
  } finally {
    pool.end();
  }
}

addPasswordColumn();


export default app;
