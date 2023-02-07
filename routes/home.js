const { Router } = require('express')
const router = Router();
const db = require('../database/database');
const session = require('express-session');
const path = require('path');


const isAuth = (req,res,next)=>{    
  if(req.session.authenticated)
      next();
  else
      res.redirect('http://localhost:5500/login.html');
  }

const getUsername = async(req,res,next)=>{    
 
}

router.use('/check',isAuth, async(req,res)=>{
  let userExist = await db.getDb().collection('collection').findOne({ email: req.session.user})
  if (userExist){
    try {
       res.status(200).send(JSON.stringify({data: userExist.data, email: req.session.user}  ));  
    } catch{
      console.log("greska u dohvacanju username-a");
      res.status(403).send("neap");
    }
}   
}) 

router.post('/logout',isAuth, function(req, res){
    try {
      req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect("http://localhost:5500/login.html")
      });
    } catch (error) {
      console.log("bug");
      res.redirect("http://localhost:5500/login.html")
    } 
 });

module.exports = router;

