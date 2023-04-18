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

router.get('/', async(req, res) => {
    console.log("test");
    try {
        const prakseTemp = await db.getDb().collection("prakse").find().limit(4); 
        let prakse = await prakseTemp.toArray();
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