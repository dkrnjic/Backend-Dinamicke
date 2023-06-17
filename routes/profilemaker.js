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

router.use('/check', async(req,res)=>{
  
  res.status(200).send();
}) 

router.use('/upload', upload.single('image'), (req, res) => {
  let img;
  if (!req.file) {
    return res.status(400).send('No file was uploaded.');
  }
  var array = req.file.path.split("\\");
  img = array.pop();
  //img= req.file.path;
   res.status(200).json(img);
});

const doesExist = async(req,res,next)=>{    
  
  const TokenUsername= req.user.username;
  console.log(TokenUsername);
  let userExist = await db.getDb().collection('collection').findOne({ email: TokenUsername})
    if (userExist){
      let img = req.body.data.avatar;
      try {
        if(img === "")
            img = "default.jpg";
    
        let test = await db.getDb().collection('collection').findOneAndUpdate(
          { email : TokenUsername},
          { $set: {"data":{
                          "ime" : req.body.data.ime, "prezime" : req.body.data.prezime,
                          "rodenje" : req.body.data.rodenje, "spol" : req.body.data.spol,
                          "nacionalnost" : req.body.data.nacionalnost, "mob" : req.body.data.mob,
                          "lokacija" : req.body.data.lokacija, "profesija" : req.body.data.profesija,
                          "about" : req.body.data.about, "vjestine" : req.body.data.vjestine,
                          "avatar":img
                          }
                }
               
          } 
        
       );
       return res.status(201).json({msg:"ok"})
      } catch{
        console.log("nije mogao postat");
      }
    }
    else{
      res.status(403).json({msg: "Forbidden"})
    }
}

router.use('/postdata',doesExist,(req,res)=>{
  res.status(200).send();
}) 


module.exports = router;

