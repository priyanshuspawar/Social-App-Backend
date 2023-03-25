require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const connectDb = require("./config/dbConn");
const { register } = require("./controller/authRegister");
const corsOptions = require("./config/corsOptions");
const { users,posts } = require("./data");
const Users = require("./models/Users");
const verifyJWT = require("./middleware/authVerify");
const {postUpload} = require("./controller/posts");
const Posts = require("./models/Posts");
const PORT = process.env.PORT || 3500;

connectDb();

// for local storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage })



const app = express();

// app.use(helmet()) //for assigning headers
// app.use(helmet.crossOriginResourcePolicy); //for cross-origin resource policies
app.use(morgan("common"));  //logger

app.use(cors(corsOptions)); //for cross-origin

app.use(express.json());
app.use("/assests",express.static(path.join(__dirname,"/public/assests")))



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))  //ignoring limit for now


app.use("/",require("./routes/root"))

// ROUTES WITH FILE UPLOAD
app.post("/auth/register",upload.single("picture"),register);

app.post("/postupload",verifyJWT,upload.single("picture"),postUpload);



// AUTH ROUTE
app.use("/auth",require("./routes/authRoutes"));

// USER ROUTE
app.use("/users",require("./routes/userRoutes"));

// POST ROUTE

app.use("/posts",require("./routes/postRoutes"));

app.use("*",(req,res)=>{
    res.status(404).json({message:"error 404"})
})



mongoose.connection.once("open",()=>{
    console.log("connected to mongoDB");
    app.listen(PORT,()=>{
        console.log(`listening on http://localhost:${PORT}`);
    });
})
mongoose.connection.on("error",()=>{
    console.log("error");
})

