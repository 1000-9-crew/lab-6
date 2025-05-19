const { body, param, validationResult, matchedData } = require("express-validator");
const createError = require("http-errors");
const { query } = require("../node_modules/express-validator/lib/index");

const validateLogin = [
    body("login")
        .trim()
        .notEmpty().withMessage("Login is required")
        .isAscii().withMessage("Login must be ASCII"),

    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isAscii().withMessage("Password must be ASCII")
        .isLength({ min: 2 }).withMessage("Password must be at least 2 characters long"),
];

const validateRegister = [
    ...validateLogin,

    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isAscii().withMessage("Name must be ASCII"),

    body("role")
        .isIn(['teacher', 'student']).withMessage('Role must be either "teacher" or "student"'),
];

const validateParamsAsInt = (params) => {
    return params.map((paramName) =>
        param(paramName)
            .isInt().withMessage(`${paramName} must be an integer`)
            .toInt()
    );
};

const validateIds = (fieldNames) => {
    return fieldNames.map((fieldName) =>
        body(fieldName)
            .isInt().withMessage(`${fieldName} must be an integer`)
            .toInt()
    );
};

const validateId = (fieldName) => {
    return body(fieldName)
        .isInt().withMessage(`${fieldName} must be an integer`)
        .toInt();
};

const formValidators = {
    subjectName: body("name")
        .trim()
        .notEmpty().withMessage("Name is required"),

    lessonDate: body("date")
        .notEmpty().withMessage("Date is required")
        .isDate({ format: "YYYY-MM-DD", strictMode: true }).withMessage("Date must be a valid date in the format YYYY-MM-DD")
    , //.toDate()

    lessonName: body("name")
        .trim()
        .notEmpty().withMessage("Name is required"),

    Id: body("id")
        .isInt().withMessage("Ids must be an integers")
        .toInt(),

    mark: body("mark")
        .customSanitizer(value => {
            if (value === 'null' || value === '') return null;
            return value;
        })
        .optional({ nullable: true })
        .isInt({ min: 0, max: 100 }).withMessage("Mark must be an integer between 0 and 100")
        .toInt()
        .default(null),

    attendance: body("attendance")
        .customSanitizer(value => value === "on" || value === "true" || value === true ? true : false),
        //.toBoolean(),
};

const validateCreateSubject = [
    formValidators.subjectName,
];

const validateCreateLesson = [
    formValidators.lessonName,
    formValidators.lessonDate,
];

const validateCreateMark = [
    validateId("studentId"),
    formValidators.mark,
    formValidators.attendance,
];

const validateEditMark = [
    formValidators.mark,
    formValidators.attendance,
];

const validateEnrollment = [
    validateId("studentId"),
    validateId("subjectId"),
];

const validateEnrollStudent = [
    validateId("studentId"),
]

const validateStudentStatus = [
    query("status")
        .optional()
        .isIn(['enrolled', 'unenrolled']).withMessage('Status must be either "enrolled" or "unenrolled"'),
];

const validatePagePagination = [
    query("page")
        //.optional()
        .default(1)
        .isInt({ min: 1 }).withMessage("Page must be an integer greater than 0")
        .toInt(),

    query("pageSize")
        //.optional()
        .default(10)
        .isInt({ min: 1 }).withMessage("Page size must be an integer greater than 0")
        .toInt(),
];


const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        req.matchedData = matchedData(req);
        return next();
    }

    const errorMessages = errors.array().map(err => err.msg); // Extract error messages

    if (req.originalUrl.startsWith('/api')) {
        // Return JSON for API routes
        return res.status(400).json({
            error: {
                message: "Validation Error",
                details: errorMessages
            }
        });
    }

    // Render error page for non-API routes
    return res.status(400).render('error', {
        message: "Validation Error",
        error: { stack: errorMessages.join("\n") }
    });
};

const registerParamHandlers = (router, params) => {
    params.forEach(param => {
        router.param(param, (req, res, next, value) => {
            const parsedValue = parseInt(value, 10);
            if (isNaN(parsedValue)) {
                return next(createError(400, `Invalid ${param}. It must be an integer.`));
            }
            req.params[param] = parsedValue;
            next();
        });
    });
};

module.exports = {
    validateLogin,
    validateRegister,
    validateCreateSubject,
    validateCreateLesson,
    validateCreateMark,
    validateEditMark,
    validateEnrollment,
    validateEnrollStudent,
    validateStudentStatus,
    validatePagePagination,
    handleValidationErrors,
    registerParamHandlers
};