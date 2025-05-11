const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { checkRole, getUserInfoJWT } = require("../../middleware/authMiddleware");
const teacherController = require("../../controllers/api/teacherController");
const { validateCreateSubject,
        validateCreateLesson,
        validateCreateMark,
        validateEditMark,
        validateEnrollment,
        validateEnrollStudent,
        validateStudentStatus,
        handleValidationErrors,
        registerParamHandlers } = require("../../middleware/validators");

router.use(getUserInfoJWT);
router.use(checkRole("teacher"));

registerParamHandlers(router, ['subject_id', 'lesson_id', 'mark_id', 'student_id']);


// Subjects
router.get("/subjects", teacherController.getSubjects);
router.get("/subjects/:subject_id", teacherController.getSubject);
router.post("/subjects", validateCreateSubject, handleValidationErrors, teacherController.createSubject);

// Students
// query: ?status= unenrolled/enrolled
router.get("/subjects/:subject_id/students", validateStudentStatus, handleValidationErrors, teacherController.getStudents);
router.post("/subjects/:subject_id/students", validateEnrollStudent, handleValidationErrors, teacherController.enrollStudent);
router.delete("/subjects/:subject_id/students/:student_id", teacherController.unEnrollStudent);

// Lessons
router.get("/subjects/:subject_id/lessons", teacherController.getSubjectLessons);
router.post("/subjects/:subject_id/lessons", validateCreateLesson, handleValidationErrors, teacherController.createLesson);
router.delete("/subjects/:subject_id/lessons/:lesson_id", teacherController.deleteLesson);

// Marks
router.get("/subjects/:subject_id/lessons/:lesson_id/marks", teacherController.getLessonJournal);
router.post("/subjects/:subject_id/lessons/:lesson_id/marks", validateCreateMark, handleValidationErrors, teacherController.createMark);
router.delete("/subjects/:subject_id/lessons/:lesson_id/marks/:mark_id", teacherController.deleteMark);
router.patch("/subjects/:subject_id/lessons/:lesson_id/marks/:mark_id", validateEditMark, handleValidationErrors, teacherController.editMark);


module.exports = router;