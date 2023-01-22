const { Router } = require('express')
const router = Router();
const bcrypt = require('bcrypt');
//connect to Mongodb
const db = require('../database/database');

const cookie = require('../cookies');

const session = require('express-session');
const store = new session.MemoryStore();

var expiryDate =  1000 * 60 * 60;
router.use(session({
    secret: 'mysecret', // use a secret string to encrypt the session data
    resave:false,
    //sameSite:"none",
    //httpOnly: true,
    saveUninitialized: false,//login inace ce novi session id za svaki req do servera
    cookie:( {Name: 'myCookie',sameSite: 'strict' ,maxAge: 10, secure: true  }),  
    store
  }));


router.use((req,res,next)=>{
    console.log("Ulazak u login route");
    next();
  })

router.post('/', async(req,res)=>{
    let userExist = await db.getDb().collection('collection').findOne({ email: req.body.email})
    //console.log(userExist);
    if (userExist){
         try{
            if(await bcrypt.compare(req.body.password, userExist.password)){
                req.session.authenticated = true;
                let username1 = req.body.email;
                req.session.user = username1;
                req.session.userId = "1233";
                req.session.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                  });
                console.log(req.session.cookie);
                //console.log(store);
              
                res.cookie(req.session.cookie);
                //res.cookie('myCookie', 'myValue', { sameSite: 'strict',maxAge: 10000,sameSite: 'None', secure: true });
                //res.status(200).send();
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


router.get('/logout', function(req, res){
    req.session.destroy(function(){
       console.log("user logged out.")
    });
    res.redirect('http://127.0.0.1:5500/login.html');
 });

/*  app.use('/http://127.0.0.1:5500/home.html', function(err, req, res, next){
    console.log(err);
       //User should be authenticated! Redirect him to log in.
       res.redirect('/login');
    }); */

/* app.get('http://127.0.0.1:5500/home.html', checkSignIn, function(req, res){
    res.render('http://127.0.0.1:5500/home.html', {id: req.session.user.id})
});    */

module.exports = router;