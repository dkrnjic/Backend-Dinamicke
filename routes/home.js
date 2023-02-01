const { Router } = require('express')
const router = Router();
const db = require('../database/database');
const session = require('express-session');

const isAuth = (req,res,next)=>{    
  if(req.session.authenticated)
      next();
  else
      res.redirect('http://localhost:5500/login.html');
  }
  
router.use('/check',isAuth, async(req,res)=>{
    res.status(200).send();
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

