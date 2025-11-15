const Joi = require("joi");

/**
 * Express middleware for validating `req.body`, `req.query`, `req.params`
 */
const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    ["body", "query", "params"].forEach((key) => {
      if (schema[key]) {
        const { error, value } = schema[key].validate(req[key], {
          abortEarly: false,
          allowUnknown: false,
          stripUnknown: true,
        });

        if (error) errors.push(...error.details);
        else req[key] = value; // sanitized
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.map((e) => ({
          field: e.context.key,
          message: e.message,
        })),
      });
    }

    next();
  };
};

/**
 * Export Joi helpers
 */
module.exports = {
  validate,
  object: (shape) => Joi.object(shape),
  string: () => Joi.string(),
  number: () => Joi.number(),
  boolean: () => Joi.boolean(),
  array: () => Joi.array(),
  date: () => Joi.date(),
};