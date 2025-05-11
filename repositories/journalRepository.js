const prisma = require('./prisma');
const { Mark, LessonMark, MarkDetails, StudentMark } = require("../model/Mark");
const { Subject } = require("../model/Subject");
const { Lesson } = require("../model/Lesson");
const { Student } = require("../model/User");
const { Enrollment } = require("../model/Enrollment");

exports.findSubjectsbyStudentId = async (studentId) => {
    const subjects = await prisma.subject.findMany({
        where: {
            Enrollment: {
                some: { studentId }
            }
        }
    });
    return subjects.map(Subject.fromJson);
};

exports.findSubjectsByTeacherId = async (teacherId) => {
    const subjects = await prisma.subject.findMany({
        where: { teacherId }
    });
    return subjects.map(Subject.fromJson);
};

exports.findSubjectById = async (subjectId) => {
    const subject = await prisma.subject.findUnique({
        where: { id: subjectId }
    });
    return subject ? Subject.fromJson(subject) : null;
};

exports.findLessonById = async (lessonId) => {
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId }
    });
    return lesson ? Lesson.fromJson(lesson) : null;
};

exports.findLessonsBySubjectId = async (subjectId) => {
    const lessons = await prisma.lesson.findMany({
        where: { subjectId }
    });
    return lessons.map(Lesson.fromJson);
};

exports.findMarksByStudentIdAndSubjectId = async (studentId, subjectId) => {
    const lessons = await prisma.lesson.findMany({
        where: {
            subjectId,
            Mark: {
                some: { studentId },
            },
        },
        include: {
            Mark: {
                where: { studentId },
                select: {
                    mark: true,
                    attendance: true,
                },
            },
        },
    });

    return lessons.map(lesson => new LessonMark(
        Lesson.fromJson(lesson),
        lesson.Mark.map(mark => new MarkDetails(mark.mark, mark.attendance))
    ));
};

exports.findEnrolledStudentsBySubjectId = async (subjectId) => {
    const enrollments = await prisma.enrollment.findMany({
        where: { subjectId },
        include: { User: true }
    });
    return enrollments.map(enrollment => Student.fromJson(enrollment.User));
};

exports.findUnEnrolledStudentsBySubjectId = async (subjectId) => {
    const students = await prisma.user.findMany({
        where: {
            role: 'student',
            Enrollment: {
                none: { subjectId }
            }
        }
    });
    return students.map(Student.fromJson);
};

exports.findMarksWithStudentByLessonId = async (lessonId) => {
    const marks = await prisma.mark.findMany({
        where: { lessonId },
        include: { User: true }
    });
    return marks.map(mark => new StudentMark(
        mark.id,
        new Student(mark.studentId, mark.User.name),
        mark.mark,
        mark.attendance
    ));
};

exports.insertSubject = async (subject) => {
    const createdSubject = await prisma.subject.create({
        data: {
            teacherId: subject.teacherId,
            name: subject.name
        }
    });
    return Subject.fromJson(createdSubject);
};

exports.insertLesson = async (lesson) => {
    const createdLesson = await prisma.lesson.create({
        data: {
            subjectId: lesson.subjectId,
            name: lesson.name,
            date: new Date(lesson.date)
        }
    });
    return Lesson.fromJson(createdLesson);
};

exports.removeLessonById = async (lessonId) => {
    const deletedLesson = await prisma.lesson.delete({
        where: { id: lessonId }
    });
    return !!deletedLesson;
};

exports.insertMark = async (mark) => {
    const createdMark = await prisma.mark.create({
        data: {
            lessonId: mark.lessonId,
            studentId: mark.studentId,
            mark: mark.mark,
            attendance: mark.attendance
        }
    });
    return Mark.fromJson(createdMark);
};

exports.findMarkById = async (markId) => {
    const mark = await prisma.mark.findUnique({
        where: { id: markId }
    });
    return mark ? Mark.fromJson(mark) : null;
};

exports.removeMarkById = async (markId) => {
    const deletedMark = await prisma.mark.delete({
        where: { id: markId }
    });
    return !!deletedMark;
};

exports.updateMarkById = async (markId, newMark) => {
    const updatedMark = await prisma.mark.update({
        where: { id: markId },
        data: {
            mark: newMark.mark,
            attendance: newMark.attendance
        }
    });
    return Mark.fromJson(updatedMark);
};

exports.insertEnrollment = async (enrollment) => {
    const createdEnrollment = await prisma.enrollment.create({
        data: {
            subjectId: enrollment.subjectId,
            studentId: enrollment.studentId
        }
    });
    return Enrollment.fromJson(createdEnrollment);
};

exports.removeEnrollmentBySubjectIdAndStudentId = async (subjectId, studentId) => {
    await prisma.$transaction(async (tx) => {
        // get all lessonIds for the given subjectId
        const lessons = await tx.lesson.findMany({
            where: { subjectId },
            select: { id: true },
        });
        const lessonIds = lessons.map(lesson => lesson.id);

        // delete marks for the student in the lessons of the subject
        await tx.mark.deleteMany({
            where: {
                studentId,
                lessonId: { in: lessonIds },
            },
        });

        // throw new Error("Transaction failed (demo ROLLBACK)");

        // delete the enrollment
        await tx.enrollment.delete({
            where: {
                subjectId_studentId: {
                    subjectId,
                    studentId,
                },
            },
        });
    });
    return true;
};

exports.findEnrollmentBySubjectIdAndStudentId = async (subjectId, studentId) => {
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            subjectId_studentId: { subjectId, studentId }
        }
    });
    return enrollment ? Enrollment.fromJson(enrollment) : null;
};