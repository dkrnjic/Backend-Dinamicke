const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../database/database');

router.post('/login', async (req, res) => {
  let userExist = await db.getDb().collection('collection').findOne({ email: req.body.email });
  if (userExist) {
    try {
      if (await bcrypt.compare(req.body.password, userExist.password)) {
        const token = jwt.sign({ username: req.body.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token: token });
      } else {
        console.log('Unsuccessful login');
        res.status(403).json('Bad credentials');
      }
    } catch {
      res.status(404).send();
    }
  } else {
    return res.status(422).json({ error: 'Korisnik ne postoji' });
  }
});

module.exports = router;
