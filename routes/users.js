const { Router } = require('express')
const router = Router();
const { ObjectId } = require('mongodb');

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

  router.get('/getUsers', async (req, res) => {
    console.log("test");
    try {
      const start = parseInt(req.query.start) || 0;
      const korisniciTemp = await db.getDb().collection("collection").find({ admin: { $exists: false } }).skip(start).limit(4);
      let korisnici = await korisniciTemp.toArray();
      if (korisnici === undefined || korisnici.length == 0) {
        res.status(404).json({ message: "No content" });
        return;
      }
      res.status(200).json(korisnici);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

  router.get("/userprofile/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const user = await db.getDb().collection("collection").findOne({ _id: new ObjectId(id) });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;
