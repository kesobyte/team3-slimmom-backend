import Joi from "joi";

// validation for register
const registerValidation = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// validation for login
const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// validation for email
const emailValidation = Joi.object({
  email: Joi.string().email().required(),
});

// validation for calculator
const calculatorValidation = Joi.object({
  height: Joi.number().required(),  // Correcting to 'heigth' if you want to keep the typo
  dWeight: Joi.number().required(),
  age: Joi.number().required(),
  cWeight: Joi.number().required(),
  bloodType: Joi.number().required().valid(1,2,3,4),
  dailyCalories: Joi.number().required(),
});

// prettier-ignore
export {  registerValidation, loginValidation, emailValidation, calculatorValidation };
