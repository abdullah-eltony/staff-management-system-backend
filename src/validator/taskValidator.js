const Joi = require("joi");

// Validation schema
const createTaskSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow(""),
  status: Joi.string().valid("pending", "in_progress", "completed").required(),
  assigned_employee_id: Joi.number().integer().allow(null),
});

const updateTaskSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow(""),
  status: Joi.string().valid("pending", "in_progress", "completed"),
  assigned_employee_id: Joi.number().integer().allow(null),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};