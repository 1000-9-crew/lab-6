const teacherService = require("../../services/teacherService");
const { SubjectCreateDTO } = require("../../model/Subject");
const { LessonCreateDTO } = require("../../model/Lesson");
const { MarkCreateDTO, MarkUpdateDTO } = require("../../model/Mark");


// Subjects
exports.getSubjects = async (req, res, next) => {
    try {
        res.json(await teacherService.getSubjects(res.locals.user.id));
    }
    catch (err) {
        next(err);
    }
};

exports.getSubject = async (req, res, next) => {
    const { subject_id } = req.params;

    try {
        res.json(await teacherService.getSubject(res.locals.user.id, subject_id));
        // lessons: await teacherService.getSubjectLessons(res.locals.user.id, subject_id)
    }
    catch (err) {
        next(err);
    }
};

exports.createSubject = async (req, res, next) => {
    const { name } = req.matchedData;

    try {
        res.status(201).json(await teacherService.createSubject(res.locals.user.id, new SubjectCreateDTO(name)))
    }
    catch (err) {
        next(err);
    }
};


// Students
exports.getStudents = async (req, res, next) => {
    const { subject_id } = req.params;
    const { status } = req.matchedData;

    try {
        if (status === "enrolled") {
            return res.json(await teacherService.getEnrolledStudents(res.locals.user.id, subject_id));
        }
        else if (status === "unenrolled") {
            return res.json(await teacherService.getUnenrolledStudents(res.locals.user.id, subject_id));
        }
        else {
            res.json({
                enrolled: await teacherService.getEnrolledStudents(res.locals.user.id, subject_id),
                unenrolled: await teacherService.getUnenrolledStudents(res.locals.user.id, subject_id)
            });
        }
    }
    catch (err) {
        next(err);
    }
};

exports.enrollStudent = async (req, res, next) => {
    const { studentId } = req.matchedData;
    const { subject_id } = req.params;

    try {
        await teacherService.enrollStudent(res.locals.user.id, subject_id, studentId);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}

exports.unEnrollStudent = async (req, res, next) => {
    const { subject_id, student_id } = req.params;


    try {
        await teacherService.unEnrollStudent(res.locals.user.id, subject_id, student_id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}


// Lessons
exports.getSubjectLessons = async (req, res, next) => {
    const { subject_id } = req.params;

    try {
        res.json(await teacherService.getSubjectLessons(res.locals.user.id, subject_id));
    }
    catch (err) {
        next(err);
    }
};

exports.createLesson = async (req, res, next) => {
    const { subject_id } = req.params;
    const { name, date } = req.matchedData;

    try {
        res.status(201).json(await teacherService.createLesson(res.locals.user.id, subject_id, new LessonCreateDTO(name, date)));
    }
    catch (err) {
        next(err);
    }
};

exports.deleteLesson = async (req, res, next) => {
    const { subject_id, lesson_id } = req.params;

    try {
        await teacherService.deleteLesson(res.locals.user.id, lesson_id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};


// Marks
exports.getLessonJournal = async (req, res, next) => {
    const { subject_id, lesson_id } = req.params;

    try {
        res.json(await teacherService.getLessonMarks(res.locals.user.id, lesson_id));
        // subject: await teacherService.getSubject(res.locals.user.id, subject_id),
        // lesson: await teacherService.getLesson(res.locals.user.id, lesson_id),
        // students: await teacherService.getEnrolledStudents(res.locals.user.id, subject_id),
    }
    catch (err) {
        next(err);
    }
};

exports.createMark = async (req, res, next) => {
    const { subject_id, lesson_id } = req.params;
    const { studentId, mark = null, attendance } = req.matchedData;

    try {
        res.status(201).json(await teacherService.createMark(res.locals.user.id, lesson_id, studentId, new MarkCreateDTO(mark, attendance)));
    }
    catch (err) {
        next(err);
    }
};

exports.deleteMark = async (req, res, next) => {
    const { subject_id, lesson_id, mark_id } = req.params;

    try {
        await teacherService.deleteMark(res.locals.user.id, mark_id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};

exports.editMark = async (req, res, next) => {
    const { subject_id, lesson_id, mark_id } = req.params;
    const { mark = null, attendance } = req.matchedData;

    try {
        res.json(await teacherService.editMark(res.locals.user.id, mark_id, new MarkUpdateDTO(mark, attendance)));
    }
    catch (err) {
        next(err);
    }
};