const { Router } = require('express')
const router = Router();
const db = require('../database/database');

const jwt = require('jsonwebtoken');



router.use('/check', async(req,res)=>{
  
  const TokenUsername= req.user.username;
  let userExist = await db.getDb().collection('collection').findOne({ email: TokenUsername})
  if (userExist){
    try {
      if(userExist.admin)
        res.status(200).send(JSON.stringify({data: userExist.data,email: TokenUsername,admin: true}  ));  
       else
        res.status(200).send(JSON.stringify({data: userExist.data,email: TokenUsername}  ));  
    } catch{
      console.log("greska u dohvacanju username-a");
      res.status(403).send("neap");
    }
}   
}) 

router.post('/logout', function(req, res){
    try {
      const TokenUsername= req.user.username;
      if(TokenUsername)
        return res.status(200).json({msg: "Redirect"})
      else{
        return res.status(200).json({msg: "Bug"})
      }
      
    } catch (error) {
      console.log("bug");
      return res.status(200).json({msg: "Redirect"})
    } 
 });

module.exports = router;

