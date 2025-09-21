const Joi = require('joi');

// Schema لإنشاء موظف جديد
const createEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('employee','admin').required()
});

// Schema لتحديث موظف
const updateEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  role: Joi.string().valid('employee','manager','admin')
});

module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema
};
