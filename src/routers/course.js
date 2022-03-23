// const express = require("express");
const express = require("express");
const Course = require("../models/course");
const auth = require("../middleware/auth");

const router = new express.Router();
router.post("/courses", auth, async(req, res) => {
    const course = course(req.body);
    try {
        const _course = course.save();
        res.send(_course);
    } catch (e) {
        res.status(400).send(e.toString());
    }
});

router.get("/courses", auth, async(req, res) => {
    const match = {};
    if (req.query.name) {
        match.name = req.query.name;
    }
    try {
        const _courses = await Course.find(match);
        res.send(_courses);
    } catch (error) {
        console.log(error);
        res.status(400).send(error.toString());
    }
});

module.exports = router;