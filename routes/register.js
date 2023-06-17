const { Router } = require('express')
const router = Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../database/database');
const bcrypt = require('bcrypt');

router.use((req,res,next)=>{
    console.log("Ulazak u register route");
    next();
})

const checkEmail = async(req,res,next)=>{    
   let user = await db.getDb().collection('collection').find({ email: req.body.email})
   user = await user.toArray()
   if(user!=""){
       console.log("taj email vec postoji u bazi");
       res.status(403).send("That email is already registered in a database");
       return;
       }
   else{
       try{
           const hashedPassword = await bcrypt.hash(req.body.password, 10)
           const  user = 
           {email: req.body.email ,
           password: hashedPassword,
            "data":{
                    "ime" : "", "prezime" : "",
                    "rodenje" : "", "spol" : "",
                    "nacionalnost" :"", "mob" : "",
                    "lokacija" : "", "profesija" : "",
                    "about" : "", "vjestine" : "",
                    "avatar":"default.jpg"
                    },
            "practice":{
                        "day":{
                                1:{
                                    "content":"","title":""
                                    }
                        },"fin":"false"
                       
                },
                "praksa":{
                    "status":"Nema",
                    "Naziv_poduzeca":"/",
                    "Mentor":"Petar Peric",
                    "Datum_pocetka":"/",
                    "Datum_zavrsetka":"/"},
                "status":"Pending"
            }    
           let result = await db.getDb().collection('collection').insertOne(user)
           if (result.insertedId){
               console.log("uspjeh registriranja korisnika");
               next();
           }
           else{
               console.log("neuspjeh registriranja korisnika");
               res.json({"status":"Failed"})
           }
       }
       catch{
           res.status(500).send();
       }
       }

}

router.post('/',checkEmail, async(req,res)=>{
    const token = jwt.sign({ username: req.body.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token: token , msg:`${req.body.email} saved in DB`});
})


module.exports = router;
