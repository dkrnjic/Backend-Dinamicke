const { Router } = require('express')
const router = Router();

//connect to Mongodb
const db = require('../database/database');

let users;

router.use((req,res,next)=>{
    console.log("Ulazak u users route");
    next();
})

router.get('/', async(req,res)=>{
        try {
            console.log(db);
            const usersTemp = await db.getDb().collection("collection").find();
            users = await usersTemp.toArray();
            res.status(200).json(users); 
        }
        catch (error) {
            console.log(error);
        }
  })

module.exports = router;
