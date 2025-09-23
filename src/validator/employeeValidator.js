const Joi = require('joi');

const createEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  role: Joi.string()
});

const updateEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  role: Joi.string()
});

module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema
};
