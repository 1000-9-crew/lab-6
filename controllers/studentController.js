const studentService = require("../services/studentService");

exports.getSubjects = async (req, res, next) => {
    try {
        const subjects = await studentService.getSubjects(res.locals.user.id);

        res.render("student/subjects", {
            user: res.locals.user,
            subjects: subjects
        });
    }
    catch (err) {
        next(err);
    }
};

exports.getSubjectMarks = async (req, res, next) => {
    const { subject_id } = req.params;

    try {
        const journal = await studentService.getSubjectJournal(res.locals.user.id, subject_id);

        res.render("student/journal", {
            user: res.locals.user,
            subject: journal.subject,
            marks: journal.marks
        });
    }
    catch (err) {
        next(err);
    }
};
