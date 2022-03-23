const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true,
    },
    level: {
        // required: true,
        type: Number,
        trim: true,
    },
    period: {
        type: String,
        trim: true,
    },
    target: {
        type: Number,
    },
    parent_course: {
        type: String,
        trim: true,
    },
});
const Course = mongoose.model("Course", courseSchema);
module.exports = Course;