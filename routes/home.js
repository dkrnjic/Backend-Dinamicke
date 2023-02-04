const { Router } = require('express')
const router = Router();
const db = require('../database/database');
const session = require('express-session');
const path = require('path');
let img="";
const isAuth = (req,res,next)=>{    
  if(req.session.authenticated)
      next();
  else
      res.redirect('http://localhost:5500/login.html');
  }

const getUsername = async(req,res,next)=>{    
 
}
 router.get('/images', (req, res) => {
  //const  { filename } = req.params;
  //console.log(filename);
  if(img!==""){
    const filePath =   "C:/Users/User/Desktop/Faks/Backend-Dinamicke/" + img;
    console.log(filePath);
    res.sendFile(filePath, (err) => {
      if (err) {
        return res.status(500).send({ error: 'Error retrieving image' });
      }
    });
  }
  else{
    res.status(404).send({status:"Failed"})
  }
  
}); 
  
router.use('/check',isAuth, async(req,res)=>{
  let userExist = await db.getDb().collection('collection').findOne({ email: req.session.user})
  if (userExist){
    try {
      //console.log(userExist.data.ime);
      if(userExist.data.avatar){
        img = userExist.data.avatar;
      }
       res.send(JSON.stringify({data: userExist.data, email: req.session.user}  ));  
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

