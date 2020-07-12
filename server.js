const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path")
var router = express.Router();
const session = require('express-session');
const passport = require('passport');
// const Admin = require('./models/admin');
const authData = require('./helpers/auth');

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
const albums = require('./routes/albums');
const albumImage = require('./routes/albumImage')
const joinus = require('./routes/join');

//Configurations
const { server, database } = require("./config/config");
const app = express();
//Middlewares
app.use(cors())
// parse application/json
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/public", express.static(path.join(__dirname, 'public')));

//Database connection
mongoose.connect(`mongodb+srv://albert:Admin%23777!@cluster0-8xyhu.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser :"false"});
// mongoose.connect('mongodb://localhost:27017/excelist')
//Handle database connection error
mongoose.connection.on("error",(err)=>{
    console.log("err",err);
});

//Database successfull connection
mongoose.connection.on("connected",(err,res) => {
    console.log("mongoose is connected");
});

app.use("/api/v1/login", authRoute);
app.use("/api/v1/search", search)
app.use("/api/v1/lesson", lessonRoute)
app.use("/api/v1/get-files", subscribe);
app.use("/api/v1/subscribes",subscribe);
app.use('/api/v1/students', singleData);
app.use('/api/v1/video-blog', videoBlog);
app.use("/api/v1/blogs", blogs);
app.use('/api/v1/videoblogpost', videoblogpost);
app.use('/api/v1/blogpost', blogpost);
app.use('/api/v1/user-feedbacks', feedbacks);
app.use('/api/v1/course', course);
app.use('/api/v1/filerequest', filerequest);
app.use('/api/v1/images', imageupload);
app.use('/api/v1/feedback', sendfeedback)
app.use('/api/v1/comments', comments);
app.use('/api/v1/albums', albums);
app.use('/api/v1/album-image', albumImage);
app.use('/api/v1/join', joinus);
app.use('/api/v1/certificates', certificates)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App is running in port ${PORT}`))
