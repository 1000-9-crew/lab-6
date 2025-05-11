const express = require('express');
const router = express.Router();
const { validateLogin, validateRegister, handleValidationErrors } = require("../../middleware/validators");
const authController = require("../../controllers/api/authController");
const { getUserInfoJWT  } = require("../../middleware/authMiddleware");

router.post("/register", validateRegister, handleValidationErrors, authController.register);

router.post("/login", validateLogin, handleValidationErrors, authController.loginJWT);

router.get("/me", getUserInfoJWT, authController.getMe);

module.exports = router;