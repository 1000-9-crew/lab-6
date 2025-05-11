const authService = require("../services/authService");
const createError = require('http-errors');
const jwt = require("jsonwebtoken");

exports.checkRole = (role) => {
    return (req, res, next) => {
        if (res.locals.user.role === role) { // req.session.user &&
            return next();
        }
        return next(createError(403));
    };
};

exports.getUserInfo = async (req, res, next) => {
    const user = req.session.user;
    if (!user) { // no active session
        return next(createError(401));
        return res.redirect("/");
    }

    try {
        res.locals.user = await authService.getUserProfilebyId(user.id);
        next();
    }
    catch (err) {
        return next(err);
    }
}

exports.getUserInfoJWT = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return next(createError(401, "No token provided"));
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return next(createError(401, "Invalid token"));
        }

        try {
            res.locals.user = await authService.getUserProfilebyId(decoded.id);
            next();
        }
        catch (err) {
            return next(err);
        }
    });
}