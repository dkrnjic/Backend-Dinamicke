const { Router } = require('express');
const router = Router();
const { ObjectId } = require('mongodb');
const db = require('../database/database');

router.use((req,res,next)=>{
    console.log("Ulazak u users route");
    next();
})

// GET /users - Dohvati sve korisnike  TEST 
/* router.get('/', async(req,res)=>{
        try {
          const users = await db.getDb().collection('collection').find().toArray();
          res.status(200).json(users);
        }
        catch (error) {
          console.log(error);
          res.status(500).json({ message: 'Server error' });
        }
  })
 */

  // GET /users/ - Dohvati sljedeca 4 korisnika
  router.get('/', async (req, res) => {
    try {
      const start = parseInt(req.query.start) || 0;
      const users = await db.getDb().collection('collection')
      .find({ admin: { $exists: false } })
      .skip(start)
      .limit(4)
      .toArray();
      if (users.length === 0) {
        return res.status(404).json({ message: 'No content' });
      }
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // GET /users/:id - Vrati korisnika po ID-u
  router.get("/:id", async (req, res) => { 
    try {
      const id = req.params.id;
      const user = await db.getDb().collection("collection").findOne({ _id: new ObjectId(id) });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;
