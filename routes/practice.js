const { Router } = require('express')
const bodyParser = require('body-parser');
const router = Router();
const db = require('../database/database');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use((req,res,next)=>{
    console.log("Ulazak u practice route");
    next();
})

// GET /practice/list - Dohvati podatke o praksi studenta
router.get('/list', async(req, res) => {
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

// GET /practice/ - Dohvati podatke o praksi studenta
router.get('/', async(req,res)=>{
    try {
        const tokenUsername = req.user.username;
        const userExist = await db.getDb().collection('collection').findOne({ email: tokenUsername });
    
        if (userExist) {
          if (userExist.praksa.status === "Nema") {
            return res.status(403).json({ msg: "Redirect" });
          } else {
            res.status(200).json({
              data: userExist.data,
              email: tokenUsername,
              practice: userExist.practice.fin,
              praksa: userExist.praksa
            });
          }
        } else {
          console.log("Error retrieving username");
          res.status(403).send({msg:"forbidden"});
        }
      } catch (error) {
        console.log("Error retrieving user data:", error);
        res.status(500).json({ message: "Server error" });
      }
});

// PUT /practice/choose - Izaberi praksu, te promjeni status praske
router.put('/choose', async (req, res) => {
  try {
    const tokenUsername = req.user.username;
    let naziv = req.body.Naziv_poduzeca;
        console.log(naziv);
        let praksaExist = await db.getDb().collection('prakse').findOne({ Naziv_poduzeća: naziv})
        if (!praksaExist) {
            console.log('praksa not found');
            return res.status(404).json({ message: 'praksa not found' });
        }
        let result = await db.getDb().collection('collection').updateOne(
            { email : tokenUsername },
            { $set: { 'praksa': {status:"U tijeku", Mentor:"Petar Peric", Datum_pocetka:new Date().toLocaleString(),Datum_zavrsetka:"/",Naziv_poduzeca:naziv} } },
            { upsert: true }      
        );
        res.status(201).json("OK"); 
  } catch (error) {
    console.log(error);
    res.status(500).json(error); 
  }
});


// GET /practice/:day - Dohvati podatke danu
router.get('/:day', async(req, res) => {
    try {
        const tokenUsername = req.user.username;
        const userExist = await db.getDb().collection('collection').findOne({ email: tokenUsername });
    
        if (!userExist) {
          return res.status(404).json({ message: "User not found" });
        }
    
        const day = req.params.day;
        const practiceData = userExist.practice.day;
    
        if (!practiceData || !practiceData[day]) {
          return res.status(200).json({  content: '', title: ''  });
        }
        
        res.status(200).json(practiceData[day]);
      } catch (error) {
        console.log("Error retrieving practice data:", error);
        res.status(500).json({ message: "Server error" });
      }
});

// put /practice/ - Izmjeni podatke prakse
 router.put('/', async(req,res)=>{
    try {
        const TokenUsername= req.user.username;
        let userExist = await db.getDb().collection('collection').findOne({ email: TokenUsername});

        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
          }
        
        if(userExist.practice.fin ==="false"){
            const { day, content, title } = req.body;
            const updateQuery = { $set: { [`practice.day.${day}`]: { content: content, title: title } } };
            const result = await db.getDb().collection('collection').updateOne({ email: userExist.email }, updateQuery, { upsert: true });

            res.status(201).json("OK"); 
        }
       
      
    }
    catch (error) {
        console.log("Something went wrong");
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}); 

// put /practice/predaj - Izmjeni status prakse
router.put('/predaj', async(req,res)=>{
       try {
            const TokenUsername= req.user.username;
            let userExist = await db.getDb().collection('collection').findOne({ email: TokenUsername});

            if (!userExist) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (userExist.practice.fin === "false") {
                const updateQuery = {
                    $set: {
                    'practice.fin': "true",
                    'praksa.status': "Završena",
                    'praksa.Datum_zavrsetka': new Date().toLocaleString()
                    }
                };

                const result = await db.getDb().collection('collection').updateOne({ email: userExist.email }, updateQuery, { upsert: true });

                console.log(result);
                res.status(201).json("OK");
              }
              
        }
        catch (error) {
            console.log("Error practice data: ", error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    });

module.exports = router;