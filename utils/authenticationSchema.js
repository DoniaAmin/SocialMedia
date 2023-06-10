const Joi = require('joi');
const AppError = require('./AppError');

const signupSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    bio: Joi.string().min(20).max(50),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    role: Joi.string(),
    images: Joi.string()
})

const loginSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),

})

const loginValidation = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) return next(new AppError(error.message, 400, error.details));
    next();
}
const signupValidation = (req, res, next) => {
    const { error } = signupSchema.validate(req.body, { abortEarly: false });
    if (error) return next(new AppError(error.message, 400, error.details));
    next();
}

module.exports = { loginValidation, signupValidation }