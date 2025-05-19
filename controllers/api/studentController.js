const studentService = require("../../services/studentService");
const PagePagination = require("../../model/PagePagination");

exports.getSubjects = async (req, res, next) => {
    try {
        const subjects = await studentService.getSubjects(res.locals.user.id);

        res.json(subjects);
    }
    catch (err) {
        next(err);
    }
};

exports.getSubjectMarks = async (req, res, next) => {
    const { subject_id } = req.params;
    const { page, pageSize } = req.matchedData;
    const { onlyWithMarks } = req.query;

    try {
        const journal = await studentService.getSubjectJournal(res.locals.user.id, subject_id, new PagePagination(page, pageSize), onlyWithMarks);

        res.json({
            subject: journal.subject,
            journal: journal.marks
        });
    }
    catch (err) {
        next(err);
    }
};
