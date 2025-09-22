const express = require("express");
const app = express();
app.use(express.json());

// Employee Routes
const employeeRoutes = require("./routes/employee.route");
app.use("/employees", employeeRoutes);

// Task Routes
const taskRoutes = require("./routes/task.route");
app.use("/tasks", taskRoutes);

// Report Routes
const reportRoutes = require("./routes/report.route");
app.use("/reports", reportRoutes);








module.exports = app; 
