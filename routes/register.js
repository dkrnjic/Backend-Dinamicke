const { Router } = require('express')
const router = Router();

//connect to Mongodb
const db = require('../database/database');


const bcrypt = require('bcrypt');

router.use((req,res,next)=>{
    console.log("Ulazak u register route");
    next();
})

router.post('/', async(req,res)=>{
   //console.log(req.body.email, req.body.password);
   let doc = await db.getDb().collection('collection').find({ email: req.body.email})
   doc = await doc.toArray()
   //console.log(doc);
   if(doc!=""){
       console.log("taj email vec postoji u bazi");
       res.status(403).send("That email is already registered in a database");
       return;
       }
   else{
       try{
           const hashedPassword = await bcrypt.hash(req.body.password, 10)
           const  user = {email: req.body.email ,
           password: hashedPassword};
           let result = await db.getDb().collection('collection').insertOne(user)
           if (result.insertedId){
               console.log("uspjeh registriranja korisnika");
               res.json({"status":"OK", "message":`Item ${req.body.email} saved in DB`})
           }
           else
           {
               console.log("neuspjeh registriranja korisnika");
               res.json({"status":"Failed"})
           }
       }
       catch{
           res.status(500).send();
       }
       }
})

module.exports = router;
