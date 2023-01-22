const { Router } = require('express')
const router = Router();

const session = require('express-session');
const store = new session.MemoryStore();

router.use(session({
    secret: 'mysecret', // use a secret string to encrypt the session data
    cookie: {maxAge: 1000 * 60 * 60,}, //1h
    resave:false,
    //sameSite:"none",
    httpOnly: true,
    saveUninitialized: false,//login inace ce novi session id za svaki req do servera
    cookie: { secure: true },  
    store
  }));

  function checkSignIn(req, res){
    if(req.session.user){
       next();     //If session exists, proceed to page
    } else {
       var err = new Error("Not logged in!");
       console.log(req.session.user);
       next(err);  //Error, trying to access unauthorized page!
    }
 }

 router.get('/', (req, res) => {
    if (req.session.cookie.expires < new Date()) {
      // session has expired
      // redirect to login page
      res.redirect('/login');
      return;
    }
    // Continue to next middleware
  });


module.exports = router;