const prisma = require('./prisma');
const { User, Student, Teacher } = require("../model/User");

exports.findByLogin = async (login) => {
    const user = await prisma.user.findFirst({
        where: { login },
    });
    return user ? User.fromJson(user) : null;
};

exports.findById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id },
    });
    return user ? User.fromJson(user) : null;
};

exports.insert = async (userCreateDTO) => {
    const user = await prisma.user.create({
        data: {
            name: userCreateDTO.name,
            login: userCreateDTO.login,
            password: userCreateDTO.password,
            role: userCreateDTO.role,
        },
    });
    return User.fromJson(user);
};

exports.findAllStudents = async () => {
    const students = await prisma.user.findMany({
        where: { role: 'student' },
    });
    return students.map(Student.fromJson);
};

exports.findAllTeachers = async () => {
    const teachers = await prisma.user.findMany({
        where: { role: 'teacher' },
    });
    return teachers.map(Teacher.fromJson);
};

exports.findStudentById = async (studentId) => {
    const student = await prisma.user.findFirst({
        where: { id: studentId, role: 'student' },
    });
    return student ? Student.fromJson(student) : null;
};