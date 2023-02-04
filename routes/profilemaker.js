const { Router } = require('express')
const router = Router();
 const db = require('../database/database');
const multer = require('multer');
const path = require('path');
//const session = require('express-session');

let img;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });



const isAuth = (req,res,next)=>{    
    console.log("test");
  if(req.session.authenticated)
      next();
  else
      res.redirect('http://localhost:5500/login.html');
  }
  
router.use('/check',isAuth, async(req,res)=>{
  res.status(200).send();
}) 

router.use('/upload', upload.single('image'), (req, res) => {
  console.log("test");
  if (!req.file) {
    return res.status(400).send('No file was uploaded.');
  }
  console.log(req.file.path);
  img= req.file.path;
  res.send('File uploaded to ' + req.file.path);
});

const doesExist = async(req,res,next)=>{    
  let userExist = await db.getDb().collection('collection').findOne({ email: req.session.user})
    if (userExist){
      try {
        //console.log(req.body.data.ime);
        let test = await db.getDb().collection('collection').findOneAndUpdate(
          { email : req.session.user },
          { $set: {"data":{
                          "ime" : req.body.data.ime, "prezime" : req.body.data.prezime,
                          "rodenje" : req.body.data.rodenje, "spol" : req.body.data.spol,
                          "nacionalnost" : req.body.data.nacionalnost, "mob" : req.body.data.mob,
                          "lokacija" : req.body.data.lokacija, "profesija" : req.body.data.profesija,
                          "about" : req.body.data.about, "vjestine" : req.body.data.vjestine,
                          "avatar": img
                          }
                }
          } 
       );
       res.redirect("http://localhost:5500/home.html")
      } catch{
        console.log("nije mogao postat");
      }
    }
    else{
      res.redirect("http://localhost:5500/login.html")
    }
}

router.use('/postdata',isAuth,doesExist,(req,res)=>{
  console.log("valja");
  res.status(200).send();
}) 


/* router.post('/logout',isAuth, function(req, res){
    try {
      req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect("http://localhost:5500/login.html")
      });
    } catch (error) {
      console.log("bug");
      res.redirect("http://localhost:5500/login.html")
    } 
 }); */

module.exports = router;

