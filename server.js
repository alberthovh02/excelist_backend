const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path")
var router = express.Router();
const session = require('express-session');
const passport = require('passport')

//Routes
const lessonRoute = require("./routes/index");
const subscribe = require("./routes/subscribe");
const singleData = require('./routes/singleData');
const videoBlog = require("./routes/videoblog");
const blogs = require("./routes/blogs");
const videoblogpost = require("./routes/videopost");
const blogpost = require('./routes/blogpost');
const feedbacks = require('./routes/feedbacks');
const course = require('./routes/course');
const filerequest = require('./routes/filerequest');
const imageupload = require('./routes/imageupload');
const sendfeedback = require('./routes/sendfeedback');
const comments = require('./routes/comments');
const authRoute = require('./routes/auth');
//Configurations
const { server, database } = require("./config/config");
const app = express();
//Middlewares
require('./config/passport')(passport);
app.use(cors())
// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/public", express.static(path.join(__dirname, 'public')));
// app.use(fileUpload())
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

//Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

//Database connection
mongoose.connect(`mongodb+srv://albert:Admin%23777!@cluster0-8xyhu.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser :"false"});

//Handle database connection error
mongoose.connection.on("error",(err)=>{
    console.log("err",err);
});

//Database successfull connection
mongoose.connection.on("connected",(err,res) => {
    console.log("mongoose is connected");
});

app.use("/login/admin", authRoute);
// app.use("/",router)
app.use("/lesson", lessonRoute)
app.use("/get-files", subscribe);
app.use("/subscribes",subscribe);
app.use('/students', singleData);
app.use('/video-blog', videoBlog);
app.use("/blogs", blogs);
app.use('/videoblogpost', videoblogpost);
app.use('/blogpost', blogpost);
app.use('/user-feedbacks', feedbacks);
app.use('/course', course);
app.use('/filerequest', filerequest);
app.use('/images', imageupload);
app.use('/feedback', sendfeedback)
app.use('/comments', comments)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App is running in port ${PORT}`))
