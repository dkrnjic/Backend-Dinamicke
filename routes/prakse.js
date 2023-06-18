const { Router } = require('express')
const bodyParser = require('body-parser');
const db = require('../database/database');
const { ObjectId } = require('mongodb');

const router = Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use((req,res,next)=>{
    console.log("Ulazak u praksa route");
    next();
})

router.get('/check', async(req,res)=>{
    try {
        const TokenUsername= req.user.username;
        let userExist = await db.getDb().collection('collection').findOne({ email: TokenUsername})
        if (userExist){
                if(userExist.admin)
                    return res.status(200).send(JSON.stringify({data: userExist.data, email: TokenUsername,admin: true}  ));  
                else
                    return res.status(200).send(JSON.stringify({data: userExist.data, email: TokenUsername, praksa: userExist.praksa,status:userExist.status, comment:userExist.comment}  ));  
        } else{
            console.log("Error retrieving username");
            res.status(404).json({msg:"Not Found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
    
}) 

// GET /prakse/ Vrati sve prakse
router.get('/', async (req, res) => {
    try {
        const start = parseInt(req.query.start) || 0;
        const prakseTemp = await db
            .getDb()
            .collection("collection")
            .find({ "praksa.status": "Završena" })
            .skip(start)
            .project({ email: 0, password: 0 }); 
        
        const prakse = await prakseTemp.toArray();
        if (prakse.length === 0) {
            return res.status(404).json({ message: "No content" });
          } else {
            return res.status(200).json(prakse);
          }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  });


// PUT /prakse/reject Odbijanje prakse 
router.put('/reject', async(req, res) => {
    try {
        const TokenUsername= req.user.username;
        let userExist = await db.getDb().collection('collection').findOne({ email: TokenUsername})

        if (userExist){
            if(userExist.admin){
                let result = await db.getDb().collection('collection').updateOne(
                    { _id : new ObjectId( req.body.id) },
                    { $set: {status:"Rejected",comment:req.body.comment}},
                    { upsert: true }      
                );
                if (result){
                    return  res.status(201).send(JSON.stringify({msg: "success"}  ));  
                } else{
                    return res.status(409).json({"status":"Failed"})
                }
            }else
                return res.status(403).send(JSON.stringify({data: "forbidden"})); 
        }  else
                return res.status(403).send(JSON.stringify({data: "forbidden"}));   

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});


// PUT /prakse/accept Prihvacanje prakse 
router.put('/accept', async(req, res) => {
    try {
        const TokenUsername= req.user.username;
        let userExist = await db.getDb().collection('collection').findOne({ email: TokenUsername})

        if (userExist){
                if(userExist.admin){
                    const result = await db.getDb().collection('collection').updateOne(
                        { _id : new ObjectId( req.body.id) },
                        { $set: {status:"Approved",comment:req.body.comment}},
                        { upsert: true }      
                    );
                    if (result){
                        return  res.status(201).send(JSON.stringify({msg: "success"}  ));  
                    } else{
                        return res.status(409).json({"status":"Failed"})
                    }
                }
                else
                    return res.status(403).send(JSON.stringify({data: "forbidden"}));  
        }   else
                return res.status(403).send(JSON.stringify({data: "forbidden"}));   

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});



// POST /prakse/add Dodaj novu praksu za studente
  router.post('/add', async(req, res) => {
    try {
        const TokenUsername= req.user.username;
        let userExist = await db.getDb().collection('collection').findOne({ email: TokenUsername})

        if (userExist){
            if (userExist.admin) {
                const praksaJson = {
                  "Naslov": req.body.Naslov,
                  "Naziv_poduzeća": req.body.Naziv_poduzeća,
                  "Adresa": req.body.Adresa,
                  "Kontakt": req.body.Kontakt,
                  "Slika": req.body.Slika
                };
        
                const result = await db.getDb().collection('prakse').insertOne(praksaJson)
                    if (result.insertedId){
                        return  res.status(201).send(JSON.stringify({msg: "success"}  ));  
                    } else{
                        return res.status(409).json({"status":"Failed"})
                    }
                }
            else
                return res.status(403).send(JSON.stringify({data: "forbidden"}  ));  
        }  
    } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
    }
}); 
module.exports = router;