const express = require("express");
const path = require("path");
const hbs = require("hbs");
require("./db/mongoose"); //this calling just makes sure that mongoose.js runs
const userRoute = require("./routers/user");
const courseRoute = require("./routers/course");

//!paths config
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
const publicPath = path.join(__dirname, "../public");

const app = express();

const port = process.env.PORT;

//configuring express to automatically parse the incoming data in JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//public assets config
app.use(express.static(publicPath));
//template config
app.set("views", viewPath);
app.set("view engine", "hbs");
hbs.registerPartials(partialsPath);
//routes config
app.use(userRoute);
app.use(courseRoute);

app.listen(port, () => {
    console.log(`App Started on ${port}`);
});