const { Router } = require('express')
const bodyParser = require('body-parser');
const router = Router();
//connect to Mongodb
const db = require('../database/database');
const jwt = require('jsonwebtoken');
let users;

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use((req,res,next)=>{
    console.log("Ulazak u practice route");
    next();
})

    
  
router.use('/check', async(req,res)=>{
    const TokenUsername= req.user.username;
    let userExist = await db.getDb().collection('collection').findOne({ email: TokenUsername})
    if (userExist){
        try {
            if(userExist.praksa.status=="Nema"){
                return res.status(403).json({msg: "Redirect"})
            }else{
                res.status(200).send(JSON.stringify({data: userExist.data, email: TokenUsername, practice: userExist.practice.fin, praksa:userExist.praksa }  )); 
            }
            
        } catch{
        console.log("greska u dohvacanju username-a");
        res.status(403).send("neap");
        }
    }   
    }) 


router.get('/:day', async(req, res) => {
    const TokenUsername= req.user.username;
    let userExist = await db.getDb().collection('collection').findOne({ email: TokenUsername});
    if (userExist){
        const day = req.params.day;
        console.log(day);
        console.log("test");
        try {
        const userPractice = await db.getDb().collection('collection').findOne({ email: TokenUsername });
        console.log({ email: TokenUsername });
        if (!userPractice) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const practiceData = userPractice.practice.day;
        if (!practiceData[day]) {
            res.status(404).json({ message: "Practice data for the requested day not found" });
            return;
        }
    
        res.status(200).json(practiceData[day]);
        } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
        }
    }   
    else{
        return res.status(200).json({msg: "Redirect"})
    }
  }); 




  router.post('/', async(req,res)=>{
    try {
        const TokenUsername= req.user.username;
        let userExist1 = await db.getDb().collection('collection').findOne({ email: TokenUsername});
        if(userExist1.practice.fin ==="false"){
            const { day, content, title } = req.body;
            console.log(title);
            if (!userExist1) {
                console.log('User not found');
                return res.status(404).json({ message: 'User not found' });
            }
            let result = await db.getDb().collection('collection').updateOne(
                { email : userExist1.email },
                { $set: { [`practice.day.${day}`]: {content:content, title:title} } },
                { upsert: true }      
            );
            console.log(result);
            res.status(201).json("OK"); 
        }
       
      
    }
    catch (error) {
        console.log("Something went wrong");
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.post('/predaj', async(req,res)=>{
       try {
            const TokenUsername= req.user.username;
            let userExist1 = await db.getDb().collection('collection').findOne({ email: TokenUsername});
            if (!userExist1) {
                console.log('User not found');
                return res.status(404).json({ message: 'User not found' });
            }
            if (userExist1.practice.fin === "false") {
                let result = await db.getDb().collection('collection').updateOne(
                    { email : userExist1.email },
                    { 
                        $set: { 
                            'practice.fin': "true",
                            'praksa.status': "Završena",
                            'praksa.Datum_zavrsetka': new Date().toLocaleString()
                        } 
                    },
                    { upsert: true }
                );
                console.log(result);
                res.status(201).json("OK");
              }
              
        }
        catch (error) {
            console.log("Something went wrong");
            console.log(error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    });

module.exports = router;