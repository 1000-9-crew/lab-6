const authService = require("../../services/authService");
const createError = require('http-errors');
const { UserCreateDTO, UserAuthDTO } = require("../../model/User");
const jwt = require("jsonwebtoken");


exports.loginJWT = async (req, res, next) => {
    const { login, password } = req.matchedData;

    try {
        const user = await authService.login(new UserAuthDTO(login, password));

        jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) {
                return next(createError(500, "Error signing token"));
            }

            res.json({
                message: "Login successful",
                token,
                user
            });
        });
    }
    catch (err) {
        next(err);
    };
};

exports.register = async (req, res, next) => {
    const { name, login, password, role } = req.matchedData;

    try {
        await authService.register(new UserCreateDTO(name, login, password, role));

        res.status(201).json({
            message: "User created successfully"
        });
    }
    catch (err) {
        next(err);
    };
};

exports.getMe = async (req, res, next) => {
    res.json(res.locals.user);
};