import express from "express";
import cors from "cors";
const app = express();
app.use(express.json());

// Enable CORS for all origins
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization","x-api-key"],
  })
);

// auth Router
import authRouter from "./routes/auth.route.js";
app.use("/login", authRouter);

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

export default app;
