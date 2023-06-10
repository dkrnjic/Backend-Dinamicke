const { Router } = require('express')
const bodyParser = require('body-parser');
const router = Router();
const session = require('express-session');
//connect to Mongodb
const db = require('../database/database');
const { ObjectId } = require('mongodb');

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
        res.redirect('https://webapps-projekt-frontend-dkrnjic.onrender.com/login.html');
    }

router.use('/check',isAuth, async(req,res)=>{
    let userExist = await db.getDb().collection('collection').findOne({ email: req.session.user})
    if (userExist){
        try {
            if(userExist.admin)
                res.status(200).send(JSON.stringify({data: userExist.data, email: req.session.user,admin: true}  ));  
            else
            res.status(200).send(JSON.stringify({data: userExist.data, email: req.session.user, praksa: userExist.praksa,status:userExist.status, comment:userExist.comment}  ));  
           
        } catch{
        console.log("greska u dohvacanju username-a");
        res.status(403).send("neap");
        }
    }   
}) 

router.get('/checkAdmin',isAuth, async(req,res)=>{
    let userExist = await db.getDb().collection('collection').findOne({ email: req.session.user})
    if (userExist){
        try {
            if(userExist.admin)
                res.status(200).send(JSON.stringify({data: userExist.data, email: req.session.user,admin: true}  ));  
            else
            res.status(200).send(JSON.stringify({data: "forbidden"}  ));  
           
        } catch{
        console.log("greska u dohvacanju username-a");
        res.status(403).send("neap");
        }
    }   
}) 

router.get('/prakseAdmin', async (req, res) => {
    try {
      const start = parseInt(req.query.start) || 0;
      const prakseTemp = await db
        .getDb()
        .collection("collection")
        .find({ "praksa.status": "Završena" })
        .skip(start)
        
        .project({ email: 0, password: 0 }); // Exclude email, password, and data fields
        
        
      let prakse = await prakseTemp.toArray();
      console.log(prakse);
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
  

router.post('/test', async(req, res) => {
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

router.post('/reject',isAuth, async(req, res) => {
    try {
        let userExist = await db.getDb().collection('collection').findOne({ email: req.session.user})
        if (userExist){
            try {
                if(userExist.admin){
                    let result = await db.getDb().collection('collection').updateOne(
                        { _id : new ObjectId( req.body.id) },
                        { $set: {status:"Rejected",comment:req.body.comment}},
                        { upsert: true }      
                    );
                  return res.status(200).send(JSON.stringify({msg: "success"}  ));  
                }
                else{
                    return  res.status(200).send(JSON.stringify({msg: "forbidden"}  ));  
                }
            } catch{
            console.log("greska u dohvacanju username-a");
            res.status(403).send("neap");
            }
        }   
        res.status(403).json({msg: "forbidden"}); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});


router.post('/accept',isAuth, async(req, res) => {
    try {
        let userExist = await db.getDb().collection('collection').findOne({ email: req.session.user})
        if (userExist){
            try {
                if(userExist.admin){
                    let result = await db.getDb().collection('collection').updateOne(
                        { _id : new ObjectId( req.body.id) },
                        { $set: {status:"Approved",comment:req.body.comment}},
                        { upsert: true }      
                    );
                    return  res.status(200).send(JSON.stringify({msg: "success"}  ));  
                }
                else
                    return res.status(200).send(JSON.stringify({data: "forbidden"}  ));  
               
            } catch(error){
            console.log("greska u dohvacanju username-a",error);
                return res.status(403).send("neap");
            }
        }   
        res.status(201).json(req.body.comment); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});


router.get('/', async(req, res) => {
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
        let userExist = await db.getDb().collection('collection').findOne({ email: req.session.user})
        if (userExist){
            try {
                if(userExist.admin){
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
                        return res.json({"status":"Failed"})
                    }
                   
                    return  res.status(200).send(JSON.stringify({msg: "success"}  ));  
                }
                else
                    return res.status(200).send(JSON.stringify({data: "forbidden"}  ));  
               
            } catch(error){
            console.log("greska u dohvacanju username-a",error);
                return res.status(403).send("neap");
            }
        }  
       
    } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
    }
}); 
module.exports = router;