class Lesson {
    id;
    subjectId;
    name;
    date; // YYYY-MM-DD

    constructor(id, subjectId, name, date) {
        this.id = id;
        this.subjectId = subjectId;
        this.name = name;
        this.date = date;
    }

    static fromJson(json) {
        const formattedDate = new Date(json.date).toISOString().split('T')[0];
        return new Lesson(json.id, json.subjectId, json.name, formattedDate);
    }
}

class LessonCreateDTO {
    name;
    date;

    constructor(name, date) {
        this.name = name;
        this.date = date;
    }
}

module.exports = { Lesson, LessonCreateDTO };