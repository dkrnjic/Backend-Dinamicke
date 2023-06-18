const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../database/database');

// POST /login - User login
router.post('/login', async (req, res) => {
  try {
    const user = await db.getDb().collection('collection').findOne({ email: req.body.email });

    if (user) {
      const passwordMatch = await bcrypt.compare(req.body.password, user.password);
      if (passwordMatch) {
        const token = jwt.sign({ username: req.body.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token });
      } else {
        console.log('Unsuccessful login');
        return res.status(403).json('Bad credentials');
      }
    } else {
      return res.status(422).json({ error: 'User does not exist' });
    }
  } catch (error) {
    console.error('Error while logging in:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
