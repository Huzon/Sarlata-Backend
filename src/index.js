const express = require("express");
require("./db/mongoose"); //this calling just makes sure that mongoose.js runs
const userRoute = require("./routers/user");
const courseRoute = require("./routers/course");

const app = express();
const port = process.env.PORT;

//configuring express to automatically parse the incoming data in JSON format
app.use(express.json());
app.use(userRoute);
app.use(courseRoute);

app.listen(port, () => {
    console.log(`App Started on ${port}`);
});