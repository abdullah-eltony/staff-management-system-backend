import Joi from 'joi'

export const createEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  password:Joi.string().min(6).max(12).required(),
  email: Joi.string().email().required(),
  role: Joi.string()
});

export const updateEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  role: Joi.string(),
  password:Joi.string()
});
