const express = require("express");
const app = express();
app.use(express.json());

// Routes
const employeeRoutes = require("./routes/employee.route");
app.use("/employees", employeeRoutes);

module.exports = app; 
