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

  // Dummy user profile data
const users1 = [
    {
      name: "John Doe",
      username: "johndoe",
      email: "johndoe@example.com",
      bio: "I'm a software engineer."
    },
    {
      name: "Jane Doe",
      username: "janedoe",
      email: "janedoe@example.com",
      bio: "I'm a UX designer."
    }
  ];



router.get("/userprofile/:username", (req, res) => {
const username = req.params.username;
const user = users1.find(u => u.username === username);

if (!user) {
    return res.status(404).json({ error: "User not found." });
}

res.json(user);
});

module.exports = router;
