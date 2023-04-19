const { Router } = require('express')
const bodyParser = require('body-parser');
const router = Router();
const session = require('express-session');
//connect to Mongodb
const db = require('../database/database');

let users;

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use((req,res,next)=>{
    console.log("Ulazak u practice route");
    next();
})


const isAuth = async(req,res,next)=>{    
    if(req.session.authenticated){
        next();
    }else
        res.redirect('http://localhost:5500/login.html');
    }

    
  
router.use('/check',isAuth, async(req,res)=>{
    let userExist = await db.getDb().collection('collection').findOne({ email: req.session.user})
    if (userExist){
        try {
            if(userExist.praksa.status=="Nema"){
                res.redirect('http://localhost:5500/my-practice.html');
            }else{
                res.status(200).send(JSON.stringify({data: userExist.data, email: req.session.user, practice: userExist.practice.fin, praksa:userExist.praksa }  )); 
            }
            
        } catch{
        console.log("greska u dohvacanju username-a");
        res.status(403).send("neap");
        }
    }   
    }) 


router.get('/:day',isAuth, async(req, res) => {
    let userExist = await db.getDb().collection('collection').findOne({ email: req.session.user});
    if (userExist){
        const day = req.params.day;
        console.log(day);
        console.log("test");
        try {
        const userPractice = await db.getDb().collection('collection').findOne({ email: req.session.user });
        console.log({ email: req.session.user });
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
        res.redirect("http://localhost:5500/login.html")
    }
  }); 




  router.post('/',isAuth, async(req,res)=>{
    try {
        let userExist1 = await db.getDb().collection('collection').findOne({ email: req.session.user});
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

router.post('/predaj',isAuth, async(req,res)=>{
       try {
            let userExist1 = await db.getDb().collection('collection').findOne({ email: req.session.user});
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