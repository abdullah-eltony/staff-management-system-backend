import Joi from 'joi'

export const createEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  password:Joi.string().min(5).max(12).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("admin", "employee", "manager").required(),
});

export const updateEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  role: Joi.string().valid("admin", "employee", "manager"),
  password:Joi.string().allow(null,'').min(5).max(12)
});
