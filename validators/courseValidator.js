const Joi = require("joi");

const validateCourse = (course) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        instructor: Joi.string().required(),
        duration: Joi.number().min(1).required(),
        price: Joi.number().min(0).required(),
        students: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)) // Validate MongoDB ObjectId format
    });

    return schema.validate(course, { abortEarly: false });
};

// Middleware for validating course data
const courseValidationMiddleware = (req, res, next) => {
    const { error } = validateCourse(req.body);
    if (error) {
        return res.status(400).json({ errors: error.details.map((err) => err.message) });
    }
    next();
};

module.exports = courseValidationMiddleware;
