const { Router } = require('express')
const router = Router();
 const db = require('../database/database');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// PUT /profilemaker/profilePicture/upload - Izmjeni sliku korisnika
router.put('/profilePicture/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file was uploaded.');
    }
  
    const imgPath = req.file.path.split('\\').pop();
    res.status(200).json(imgPath);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error"  });
  }
});

 // PUT /profilemaker/userProfile - Izmjeni podatke korisnika
router.put('/userProfile', upload.single('image'), async (req, res) => {
  try {
    const tokenUsername = req.user.username;
    const userExist = await db.getDb().collection('collection').findOne({ email: tokenUsername });

    if (!userExist) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    let img = req.body.data.avatar;
    if (img === '') {
      img = 'default.jpg';
    }

    await db.getDb().collection('collection').findOneAndUpdate(
      { email: tokenUsername },
      {
        $set: {
          'data.ime': req.body.data.ime,
          'data.prezime': req.body.data.prezime,
          'data.rodenje': req.body.data.rodenje,
          'data.spol': req.body.data.spol,
          'data.nacionalnost': req.body.data.nacionalnost,
          'data.mob': req.body.data.mob,
          'data.lokacija': req.body.data.lokacija,
          'data.profesija': req.body.data.profesija,
          'data.about': req.body.data.about,
          'data.vjestine': req.body.data.vjestine,
          'data.avatar': img
        }
      }
    );

    return res.status(201).json({ msg: 'ok' });
  } catch (error) {
    console.log('Error while updating user data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

