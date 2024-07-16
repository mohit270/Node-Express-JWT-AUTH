const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const app = express();
const cookieParser = require("cookie-parser");
const {requireAuth, checkUser} = require("./middlewares/authMiddleware");

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');


// database connection
const dbURI = "mongodb://127.0.0.1:27017/todo";
mongoose.connect(dbURI, {})
  .then((result) => app.listen(8000))
  .catch((err) => console.log(err));


// app.get("/set-cookie",(req,res)=>{
//   // res.setHeader("Set-Cookie","NewUser = true");

//   res.cookie("NewUser",false);
//   res.cookie("newUser",true,{maxAge: 1000*60*60*24 , httpOnly:false });
//   res.send("you got the cookie");
// });
// app.get("/read-cookie",(req,res)=>{
//   const cookies= req.cookies;
//   console.log(cookies);
//   res.json(cookies);
// });



// routes
app.get("*",checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes); // Ensure the routes have a base path like '/auth'

