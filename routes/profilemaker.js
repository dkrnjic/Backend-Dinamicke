const { Router } = require('express')
const router = Router();
 const db = require('../database/database');
//const session = require('express-session');

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

const doesExist = async(req,res,next)=>{    
  let userExist = await db.getDb().collection('collection').findOne({ email: req.session.user})
    if (userExist){
      try {
        let test = await db.getDb().collection('collection').findOneAndUpdate(
          { email : req.session.user },
          { $set: { "ime" : req.body.ime, "prezime" : req.body.prezime}}
       );
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

