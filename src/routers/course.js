const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const Course = require("../models/course");
const auth = require("../middleware/auth");
const ParentCourse = require("../models/parent-course");
const { default: mongoose } = require("mongoose");
require("hbs");

const router = new express.Router();
router.post("/courses", auth, async (req, res) => {
  try {
    const course = Course(req.body.courses);
    console.log(req.body.courses);

    if (req.user.role == "admin") {
      if (!req.body.multiple) {
        const _course = await course.save();
        console.log(_course);
        res.send(_course);
      } else {
        // console.log("courses" + course);
        const multiple = await Course.insertMany(req.body.courses);
        res.send(multiple);
      }
    } else {
      res.status(400).send({ error: "not an admin" });
    }
  } catch (e) {
    res.status(400).send(e.toString());
  }
});

router.get("/courses", auth, async (req, res) => {
  const match = {};
  if (req.query.name) {
    match.name = req.query.name;
  }
  if (req.query.parent_course) {
    match.parent_course = req.query.parent_course;
  }
  try {
    const _courses = await Course.find(match).populate("parent");
    // await _courses.populate("parent");
    res.send(_courses);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.toString());
  }
});
router.get("/courses/:id", auth, async (req, res) => {
  try {
    const _courses = await Course.findById(req.params.id);
    // const _parentCourse = await ParentCourse.findById(_courses.parent);
    await _courses.populate("parent");
    res.send(_courses);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.toString());
  }
});

router.patch("/courses/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  const updates = Object.keys(body);
  const allowedUpdate = ["parent_course", "target", "period", "level", "name"];
  const canUpdate = updates.every((update) => allowedUpdate.includes(update));
  if (!canUpdate) {
    return res.status(400).send({ error: "Cannot update this field" });
  }
  try {
    if (req.user.role == "admin") {
      const course = await Course.findByIdAndUpdate(_id, body, {
        new: true,
      });
      console.log(course);

      res.send(course);
    } else {
      res.status(400).send({
        error: "Admin role required",
      });
    }
  } catch (e) {
    res.status(500).send({ error: e.toString() });
  }
});

//parent courses
router.post("/parent-course", auth, async (req, res) => {
  try {
    const parentCourse = ParentCourse(req.body.parentCourse);
    console.log(parentCourse);

    if (req.user.role == "admin") {
      if (!req.body.multiple) {
        const _parentCourse = await parentCourse.save();
        console.log(_parentCourse);
        res.send(_parentCourse);
      } else {
        // console.log("courses" + course);
        const multiple = await ParentCourse.insertMany(req.body.parentCourse);
        res.send(multiple);
      }
    } else {
      // console.log()
      res.status(400).send({ error: "not an admin" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e.toString());
  }
});

router.get("/parent-course", async (req, res) => {
  const match = {};
  if (req.query.name) {
    match.name = req.query.name;
  }
  if (req.query.heading) {
    match.query = req.query.heading;
  }

  try {
    const _parentCourse = await ParentCourse.find(match).populate("course");
    _parentCourse.forEach((element) => {
      console.log(element.course);
    });
    // await ParentCourse.populate("course");
    res.send({ _parentCourse, courses: _parentCourse.course });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.toString());
  }
});

router.get("/parent-course/:id", async (req, res) => {
  // const match = {
  //     _id: mongoose.Types.ObjectId(req.params.id),
  // };
  // if (req.query.name) {
  //     match.name = req.query.name;
  // }
  // if(req.query.heading){
  //   match.query = req.query.heading;
  // }

  try {
    const _parentCourse = await ParentCourse.findById(req.params.id);
    await _parentCourse.populate("course");
    console.log(_parentCourse);

    res.send({ _parentCourse, courses: _parentCourse.course });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.toString());
  }
});

//frontend files
router.get("/coursess/:parent_course", async (req, res) => {
  const parent_id = req.params.parent_course;
  // res.send(parent_course);
  try {
    const courses = await Course.find({ parent_id });
    const parent_course = courses[0].parent_course;

    if (!courses) {
      res.send("no courses found");
    }
    console.log(courses);
    res.render("courses", { parent_course, courses });
  } catch (error) {
    console.log(error);
    res.send("error");
  }
});
//for uploading course images
const upload = multer({
  // dest: "avat ars", //this is not needed when we want the file data
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    console.log("Inside multer");
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error("Upload a jpg/png/jpeg"));
    }
    return cb(undefined, true);
  },
});

//adding course from form
router.post("/course-form", auth, async (req, res) => {
  try {
    console.log("Inside course form");
    const body = req.body;
    let buffer;
    const update = Object.keys(body);
    const allowedUpdates = [
      "parent",
      "target",
      "period",
      "level",
      "name",
      "desc",
      // "image",
      "token",
    ];

    const course = Course({
      name: body.name,
      parent: mongoose.Types.ObjectId(body.parent),
      target: body.target,
      level: body.level,
      period: body.period,
      desc: body.desc,
      // image: buffer,
    });
    //!removed file fetching in this router
    // if (req.file) {
    //   buffer = await sharp(req.file.buffer)
    //     .resize({ width: 250, height: 250 })
    //     .png()
    //     .toBuffer();
    //   course.image = buffer;
    // } else {
    //   console.log("file doesnt exist");
    // }
    const isUpdateable = update.every((e) => allowedUpdates.includes(e));
    if (isUpdateable) {
      const added = await course.save();
      console.log(added);
      res.status(200).send(added);
    } else {
      console.log();
      res.status(500).send("Field not updateable");
    }
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e.message);
  }
});

router.get("/user", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});
// upload image
router.post("/upload-course/:id", upload.single("image"), async (req, res) => {
  console.log("inside upload image");
  try {
    if (req.file) {
      const image = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();

      const course = await Course.findByIdAndUpdate(
        req.params.id,
        { image },
        { new: true }
      );
      res.send("File uploaded successfully");
    } else {
      res.send("File doesnt exist");
    }
  } catch (error) {
    console.log(error);
    res.send("Error updating image");
  }
});

//getting course image
router.get("/course/image/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const course = await Course.findById(_id);
    if (!course) {
      return res.status(400).send("user not found");
    }
    res.set("content-type", "image/jpg");
    if (course.image) {
      res.send(course.image);
    } else {
      res.send("images/image3.jpg");
    }
  } catch (e) {
    res.status(500).send(e.toString);
  }
});

module.exports = router;
