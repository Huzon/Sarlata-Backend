const mongoose = require("mongoose");
//syntax : mongoose.connect('url/db-name', {options})
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    // useCreateIndex: true,
});