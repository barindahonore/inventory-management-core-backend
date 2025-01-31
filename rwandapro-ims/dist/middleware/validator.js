"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePartial = exports.validate = void 0;
const zod_1 = require("zod");
const api_errors_1 = require("../utils/api-errors");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            if (schema.body)
                schema.body.parse(req.body);
            if (schema.params)
                schema.params.parse(req.params);
            if (schema.query)
                schema.query.parse(req.query);
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                const issues = err.issues.map(issue => ({
                    path: issue.path.join('.'),
                    message: issue.message
                }));
                throw new api_errors_1.ValidationError("Validation failed", issues);
            }
            next(err);
        }
    };
};
exports.validate = validate;
// Partial validation for PATCH requests
const validatePartial = (schema) => {
    return (0, exports.validate)({
        body: schema.partial()
    });
};
exports.validatePartial = validatePartial;
