const { Router } = require('express')
const router = Router();
const session = require('express-session');
//connect to Mongodb
const db = require('../database/database');
const MongoDBSession = require('connect-mongodb-session')(session);
const store = new MongoDBSession({
    uri:db.getUri(),
    collection: db.getCollectionSession(),
})

const bcrypt = require('bcrypt');

router.use((req,res,next)=>{
    console.log("Ulazak u register route");
    next();
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
        res.redirect('http://localhost:5500/login.html');  
    }

router.use('/check',isAuth, async(req,res)=>{
    res.status(200).send();
  })

  



const checkEmail = async(req,res,next)=>{    
     //console.log(req.body.email, req.body.password);
   let doc = await db.getDb().collection('collection').find({ email: req.body.email})
   doc = await doc.toArray()
   //console.log(doc);
   if(doc!=""){
       console.log("taj email vec postoji u bazi");
       res.status(403).send("That email is already registered in a database");
       return;
       }
   else{
       try{
           const hashedPassword = await bcrypt.hash(req.body.password, 10)
           const  user = 
           {email: req.body.email ,
           password: hashedPassword,
            "data":{
                    "ime" : "", "prezime" : "",
                    "rodenje" : "", "spol" : "",
                    "nacionalnost" :"", "mob" : "",
                    "lokacija" : "", "profesija" : "",
                    "about" : "", "vjestine" : "",
                    "avatar":"default.jpg"
                    },
            "practice":{
                        "day":{
                                1:{
                                    "content":"","title":""
                                    }
                        },"fin":"false"
                       
                },
                "praksa":{
                    "status":"Nema",
                    "Naziv_poduzeca":"/",
                    "Mentor":"Petar Peric",
                    "Datum_pocetka":"/",
                    "Datum_zavrsetka":"/"},
                "status":"Pending"
            }
                    
               
            
             
           let result = await db.getDb().collection('collection').insertOne(user)
           if (result.insertedId){
               console.log("uspjeh registriranja korisnika");
               //res.cookie('myCookie', 'myValue', {sameSite: 'strict',maxAge: 1000*60*10,sameSite: 'None', secure: true });
               next();
              
           }
           else
           {
               console.log("neuspjeh registriranja korisnika");
               res.json({"status":"Failed"})
           }
       }
       catch{
           res.status(500).send();
       }
       }

}
const giveSession = (req,res,next)=>{
    req.session.authenticated = true;
    let username1 = req.body.email;
    req.session.user = username1;
    req.session.save((err)=> {if (err) console.log(err);})
    next()
};

router.post('/',checkEmail,giveSession, async(req,res)=>{
    res.redirect('http://localhost:5500/profilemaker.html');
    //res.json({"status":"OK", "message":`Item ${req.body.email} saved in DB`})
})




module.exports = router;
