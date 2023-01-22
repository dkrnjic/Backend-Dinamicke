const { Router } = require('express')
const router = Router();

/* const cookieParser = require('cookie-parser');
const cors = require('cors');
var corsOptions = {
    origin: 'http://localhost:5500',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials:true
  }
router.use(cors(corsOptions))
router.use(cookieParser()); */

 router.use((req,res,next)=>{
  //res.header("Access-Control-Allow-Origin", "yourfrontend.com");
  //res.header("Access-Control-Allow-Credentials", true);
  console.log("Ulazak u cookies route");
  next();
})

router.get('/setcookie', (req, res) => {
    console.log("setcookie");
    var expiryDate = new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000);
    res.cookie('myCookie', 'myValue', { sameSite: 'strict',maxAge: 1000000,sameSite: 'None', secure: true });
    res.send('Cookie has been set');
  });

  router.get('/getcookie', (req, res) => {
    res.send(req.cookies.myCookie);
  });

  router.get('/clearcookie', (req, res) => {
    res.clearCookie('myCookie');
    res.send('Cookie has been cleared');
  });

  module.exports = router;