const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../database/database');
const bcrypt = require('bcrypt');

router.use((req, res, next) => {
  console.log("Entering the register route");
  next();
});

// Middleware za provjerit jel email postoji
const checkEmail = async (req, res, next) => {
  try {
    const existingUser = await db.getDb().collection('collection').findOne({ email: req.body.email });
    if (existingUser) {
      console.log("The email already exists in the database");
      return res.status(403).json({ error: "That email is already registered in the database" });
    }
    next();
  } catch (error) {
    console.error("Error while checking email:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//Default endpoint za registraciju
router.post('/', checkEmail, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      email: req.body.email,
      password: hashedPassword,
      data: {
        ime: "",
        prezime: "",
        rodenje: "",
        spol: "",
        nacionalnost: "",
        mob: "",
        lokacija: "",
        profesija: "",
        about: "",
        vjestine: "",
        avatar: "default.jpg"
      },
      practice: {
        day: {
          1: {
            content: "",
            title: ""
          }
        },
        fin: "false"
      },
      praksa: {
        status: "Nema",
        Naziv_poduzeca: "/",
        Mentor: "Petar Peric",
        Datum_pocetka: "/",
        Datum_zavrsetka: "/"
      },
      status: "Pending"
    };

    const result = await db.getDb().collection('collection').insertOne(user);
    if (result.insertedId) {
      const token = jwt.sign({ username: req.body.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ token, msg: `${req.body.email} saved in DB` });
    } else {
      console.log("Failed to register the user");
      return res.status(500).json({ error: "Failed to register the user" });
    }
  } catch (error) {
    console.error("Error while registering the user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
