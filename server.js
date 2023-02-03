const express = require("express");
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.static('../Projekt-Dinamicke'))
app.use(express.urlencoded({ extended: false }));

//routes
const usersRoute= require('./routes/users')
const registerRoute= require('./routes/register')
const AuthRoute= require('./routes/auth')
const homeRoute= require('./routes/home')
const profileMakerRoute= require('./routes/profilemaker')
const cookieRoute= require('./tests/cookies')
const db = require('./database/database');
db.connectToServer();

const cookieParser = require('cookie-parser');
const cors = require('cors');
var corsOptions = {
    origin: 'http://localhost:5500',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials:true
  }
app.use(cors(corsOptions))
app.use(cookieParser());

app.use((req,res,next)=>{
  console.log("Type: "+ req.method + ",  Route: " + req.url);
  next();
})

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server slusa "+ PORT);
    else 
        console.log("error ne moze se spojit na port i error je", error);
})



app.use('/users',usersRoute);

app.use('/register',registerRoute);

app.use('/',AuthRoute);

app.use('/cookies',cookieRoute);

app.use('/home',homeRoute);

app.use('/profilemaker',profileMakerRoute);

/* app.use('/',cookieRoute); */
/* 
app.get('/test', (req, res) => {
    // Check if the user is logged in
    
    if (!req.session.user) {
      // If the user is not logged in, redirect them to the login page
      res.redirect('http://localhost:5500/login.html');
      return;
    }
    // If the user is logged in, render the home page or continue to the next middleware
    //res.render('home', { username: req.session.user });
  });
   */