const mongoose = require("mongoose");
const parentCourseSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
    },
    heading:{
        required: true,
        type: String,
        trim: true,
        lowercase: true,

    },  
});
parentCourseSchema.virtual("course", {
    ref: "Course",
    localField: "_id",
    foreignField: "parent",
});

const ParentCourse = mongoose.model("ParentCourse",parentCourseSchema);

module.exports = ParentCourse;