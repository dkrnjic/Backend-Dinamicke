const { Router } = require('express')
const bodyParser = require('body-parser');
const router = Router();
const session = require('express-session');
//connect to Mongodb
const db = require('../database/database');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use((req,res,next)=>{
    console.log("Ulazak u praksa route");
    next();
})

const isAuth = async(req,res,next)=>{    
    if(req.session.authenticated){
        next();
    }
        
    else
        res.redirect('http://localhost:5500/login.html');
    }

router.use('/check',isAuth, async(req,res)=>{
    let userExist = await db.getDb().collection('collection').findOne({ email: req.session.user})
    if (userExist){
        try {
            res.status(200).send(JSON.stringify({data: userExist.data, email: req.session.user, praksa: userExist.praksa}  ));  
        } catch{
        console.log("greska u dohvacanju username-a");
        res.status(403).send("neap");
        }
    }   
}) 


router.post('/test', async(req, res) => {
    console.log("test1");
    try {
        let naziv = req.body.Naziv_poduzeca;
        console.log(naziv);
        let praksaExist = await db.getDb().collection('prakse').findOne({ Naziv_poduzeća: naziv})
        if (!praksaExist) {
            console.log('praksa not found');
            return res.status(404).json({ message: 'praksa not found' });
        }
        let result = await db.getDb().collection('collection').updateOne(
            { email : req.session.user },
            { $set: { 'praksa': {status:"U tijeku", Mentor:"Petar Peric", Datum_pocetka:new Date().toLocaleString(),Datum_zavrsetka:"/",Naziv_poduzeca:naziv} } },
            { upsert: true }      
        );
        console.log(result);
        res.status(201).json("OK"); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});


router.get('/', async(req, res) => {
    console.log("test");
    try {
        const start = parseInt(req.query.start) || 0; 
        const prakseTemp = await db.getDb().collection("prakse").find().skip(start).limit(4); 
        let prakse = await prakseTemp.toArray();
        if (prakse === undefined || prakse.length == 0) {
            res.status(404).json({ message: "No content" });
            return;
        }
        res.status(200).json(prakse); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});


  router.post('/add', async(req, res) => {
    try {
        let praksaJson = {
            "Naslov" : req.body.Naslov,
            "Naziv_poduzeća" : req.body.Naziv_poduzeća,
            "Adresa": req.body.Adresa,
            "Kontakt": req.body.Kontakt,
            "Slika" : req.body.Slika
            }
        let result = await db.getDb().collection('prakse').insertOne(praksaJson)
        if (result.insertedId){
            console.log("uspjeh dodavanja prakse");
        }
        else{
            console.log("neuspjeh dodavanja prakse");
            res.json({"status":"Failed"})
        }
        res.status(200).json("ok"); 
    } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
    }
}); 
module.exports = router;