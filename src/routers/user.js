const express = require("express");
const sharp = require("sharp");

const User = require("../models/user");
const ParentCourse = require("../models/parent-course");
// const hbs = require("hbs");
require("hbs");
const auth = require("../middleware/auth");

const router = new express.Router();

//testing
router.get("/user", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

router.post("/users", async (req, res) => {
  console.log(req.body);
  const user = User(req.body);
  try {
    const users = await user.save();
    const token = await users.generateNewToken();
    res.status(201).send({ users, token });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

//user login
router.post("/users/login", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    console.log("usr console" + user);
    if (!user) {
      return res.status(400).send("user doesn't exist");
    }
    const token = await user.generateNewToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(500).send("User doesn't exist");
  }
});

//logging out a user by removing the tokens
router.post("/users/logout", auth, async (req, res) => {
  try {
    console.log("user before update", req.user);
    const user = await User.findOneAndUpdate(
      {
        email: req.user.email,
      },
      {
        tokens: [],
      },
      {
        new: true,
      }
    );

    console.log("usr console" + user);
    if (!user) {
      return res.status(400).send("user doesn't exist");
    }

    res.status(200).send({ user });
  } catch (e) {
    console.log(e);
    res.status(500).send("User doesn't exist");
  }
});

router.get("/users", auth, async (req, res) => {
  try {
    const users = await req.user.getUsers();

    // const token = await user.generateNewToken();
    res.send({ users });
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

//
router.get("/", (req, res) => {
  res.render("index");
});
router.get("/home", (req, res) => {
  res.render("courses", {
    parent_course: "some course",
  });
});

//sending to the login page
router.get("/login", (req, res) => {
  res.render("login");
});

//verifying login and sending to the admin page
router.post("/login-data", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateNewToken();
    console.log(user.token);
    res.redirect(`/adminpanel/${token}`);
    // res.render("adminpanel", { user, token });
  } catch (error) {
    res.send(error.toString());
  }
});

//logging in to the admin panel for making changes
router.get("/adminpanel/:token", async (req, res) => {
  const token = req.params.token;
  const parentCourses = await ParentCourse.find({});
  console.log(parentCourses);
  // console.log("token" + token);
  if (!token || token == "") {
    return res.send("error , token notprovided");
  }
  res.render("adminpanel", {
    user: {
      name: "huzefa",
    },
    parentCourses,
    token,
  });
});

module.exports = router;
