const express = require("express");
const sharp = require("sharp");

const User = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/users", async(req, res) => {
    console.log(req.body);
    const user = User(req.body);
    try {
        const u = await user.save();
        const token = await user.generateNewToken();
        res.send(u);
    } catch (e) {
        console.log(e);
        res.status(500).send(e.toString());
    }
});

router.post("user/login", async(req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );

        const token = await user.generateNewToken();
        res.send({ user, token });
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

router.get("/users", async(req, res) => {
    try {
        const users = await User.find({});

        // const token = await user.generateNewToken();
        res.send({ users });
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

module.exports = router;