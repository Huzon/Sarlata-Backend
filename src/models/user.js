const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const course = require("./task");

const schema = new mongoose.Schema({
    //schema model objects
    name: {
        type: String,
        trim: true,
        default: "Guest",
    },
    username: {
        type: String,
        // trim: trim,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: [true, "Enter a Password"],
        minLength: [7, "Should be more than 6 digits"],
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw Error("Should not contain value password");
            }
        },
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is inValid");
            }
        },
    },
    role: {
        type: String,
        trim: true,
        default: "student",
    },
    avatar: {
        type: Buffer,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        },
    }, ],
}, {
    //schema options
    timestamps: true,
});
// schema.virtual("tasks", {
//   ref: "Task",
//   localField: "_id",
//   foreignField: "owner",
// });

//schema.method provides method for an instance of the model
schema.methods.generateNewToken = async function() {
    const user = this; //provides instance of the model
    const token = await jwt.sign({ _id: user._id.toString() },
        process.env.JWT_SECRET
    );
    user.tokens = user.tokens.concat({ token }); //adding data to an array
    user.save();

    return token;
};

//this method runs every time we convert JSON
schema.methods.toJSON = function() {
    const user = this; //provides instance of the model
    const userObject = user.toObject(); //converts data into object
    delete userObject.password; //used to remove object from an object
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
};

//Schema.statics provides method for the whole model
schema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        return new Error("Invalid login");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
        return new Error("Invalid login");
    }

    return user;
};
//Hash the plain text password before saving
schema.pre("save", async function(next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    // user[] = await bcrypt.hash(user.password, 8);
    return next();
});

schema.pre("remove", async function(next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });

    // user[] = await bcrypt.hash(user.pnpm assword, 8);
    return next();
});
const User = mongoose.model("User", schema);

module.exports = User;