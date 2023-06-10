const { Router } = require('express')
const session = require('express-session');
const router = Router();
const bcrypt = require('bcrypt');
//const cookie = require('../tests/cookies');
//connect to Mongodb
const db = require('../database/database');
const MongoDBSession = require('connect-mongodb-session')(session);
const store = new MongoDBSession({
    uri:db.getUri(),
    collection: db.getCollectionSession(),
})

router.use(session({
    secret: 'mysecret', // use a secret string to encrypt the session data
    resave:false,
    saveUninitialized: false,//login inace ce novi session id za svaki req do servera stavi na false
    store
  }));

const isAuth = (req,res,next)=>{    
    if(req.session.authenticated)
        next();
    else
        res.status(200).send(); //res.redirect('http://localhost:5500/login.html');  
    }

router.use('/check',isAuth, async(req,res)=>{
    res.redirect('http://localhost:5500/home.html');
  })

router.post('/login', async(req,res)=>{
    let userExist = await db.getDb().collection('collection').findOne({ email: req.body.email})
    if (userExist){
        try{  
            if(await bcrypt.compare(req.body.password, userExist.password)){
                req.session.authenticated = true;
                let username1 = req.body.email;
                req.session.user = username1;
                req.session.save((err)=> {if (err) console.log(err);})
                res.redirect('http://localhost:5500/home.html');
            }
            else{
                console.log("neuspjesan login");
                res.status(403).json("Bad credentials");
            }
        }
        catch{
            res.status(500).send();
        }  
        
        }
    else
        return res.status(422).json({ error: "Korisnik ne postoji" });
});

module.exports = router;


