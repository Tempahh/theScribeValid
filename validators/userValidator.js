const Joi = require("joi");

const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid("instructor", "student").required()
    });

    return schema.validate(user, { abortEarly: false });
};

// Middleware for validating user data
const userValidationMiddleware = (req, res, next) => {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).json({ errors: error.details.map((err) => err.message) });
    }
    next();
};

module.exports = userValidationMiddleware;
