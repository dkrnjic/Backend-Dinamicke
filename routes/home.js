const { Router } = require('express');
const router = Router();
const db = require('../database/database');
const jwt = require('jsonwebtoken');

// GET /home/check - Retrieve user information
router.get('/check', async (req, res) => {
  try {
    const tokenUsername = req.user.username;
    const user = await db.getDb().collection('collection').findOne({ email: tokenUsername });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const responseData = { data: user.data, email: tokenUsername };
    if (user.admin) {
      responseData.admin = true;
    }

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error while retrieving user information:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// GET /home/logout - Logout user
router.get('/logout', (req, res) => {
  try {
    const tokenUsername = req.user.username;

    if (tokenUsername) {
      return res.status(200).json({ msg: 'Redirect' });
    } else {
      return res.status(200).json({ msg: 'Bug' });
    }
  } catch (error) {
    console.error('Error while logging out:', error);
    return res.status(200).json({ msg: 'Redirect' });
  }
});


module.exports = router;
