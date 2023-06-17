const express = require("express");
const app = express();
const PORT = 8080;
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { connectToServer } = require('./database/database');
require('dotenv').config();

const uploadDir = './uploads';

const authenticateToken = (req, res, next) => {
  console.log("uso");
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // Extract the token from the Authorization header
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ error: 'Token not provided or malformed' });
  }
};

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const usersRoute = require('./routes/users');
const registerRoute = require('./routes/register');
const authRoute = require('./routes/auth');
const homeRoute = require('./routes/home');
const profileMakerRoute = require('./routes/profilemaker');
const practiceRoute = require('./routes/practice');
const praksaRoute = require('./routes/prakse');

connectToServer();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('../Projekt-Dinamicke'));
app.use("/img", express.static('uploads'));

const cors = require('cors');
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("Type: " + req.method + ",  Route: " + req.url);
  next();
});

app.listen(PORT, (error) => {
  if (!error)
    console.log("Server slusa " + PORT);
  else
    console.log("Error: Unable to connect to port. Error message:", error);
});

app.use('/users', authenticateToken, usersRoute);
app.use('/register', registerRoute);
app.use('/', authRoute);
app.use('/home', authenticateToken, homeRoute);
app.use('/profilemaker', authenticateToken, profileMakerRoute);
app.use('/practice', authenticateToken, practiceRoute);
app.use('/praksa', authenticateToken, praksaRoute);
