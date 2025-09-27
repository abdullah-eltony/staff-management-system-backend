import Joi from "joi";

// Validation schema
export const createTaskSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow(""),
  status: Joi.string().valid("pending", "in_progress", "completed"),
  assigned_employee_id: Joi.number().integer().allow(null),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow(""),
  status: Joi.string().valid("pending", "in_progress", "completed"),
  assigned_employee_id: Joi.number().integer().allow(null),
});

