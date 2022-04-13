const mongoose = require("mongoose");
const { buffer } = require("sharp/lib/is");

const courseSchema = new mongoose.Schema(
  {
    name: {
      required: [true, "Course name required"],
      type: String,
      trim: true,
      unique: [true, "Course Name already Exists"],
    },
    level: {
      // required: true,
      type: Number,
      trim: true,
    },
    price: {
      required: true,
      type: Number, //n = months
      trim: true,
    },
    period: {
      type: Number, //n = months
      trim: true,
    },
    target: {
      type: Number,
    },
    image: {
      type: buffer,
    },
    desc: {
      type: String,
    },

    favorite: {
      type: Boolean,
      default: false,
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ParentCourse",
    },
  },
  {
    timestamps: true,
  }
);
const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
