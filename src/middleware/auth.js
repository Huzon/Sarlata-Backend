const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async(req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //sends id of the user found
        console.log(decoded);
        const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token,
        });

        if (!user) {
            throw new Error();
        }
        //saving user to the req to be used later
        req.user = user;
        // saving token to req
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send("Provide a token");
    }
};

module.exports = auth;