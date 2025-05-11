const express = require('express');
const router = express.Router();
const { checkRole, getUserInfoJWT } = require("../../middleware/authMiddleware");
const studentController = require("../../controllers/api/studentController");
const createError = require('http-errors');
const { registerParamHandlers } = require("../../middleware/validators");

router.use(getUserInfoJWT);
router.use(checkRole("student"));

registerParamHandlers(router, ['subject_id']);


// Subjects
router.get("/subjects", studentController.getSubjects);

// Marks
router.get("/subjects/:subject_id/marks", studentController.getSubjectMarks);


module.exports = router;