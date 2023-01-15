const express = require("express");
const app = express();
const PORT = 8080;
const { uuid } = require('uuidv4');
app.use(express.json());
const bcrypt = require('bcrypt');
const cors = require("cors");
app.use(cors());
const session = require('express-session');
const sql = require('mssql');

const config = {
    user: 'rpuser',
    password: '1234',
    server: 'localhost',
    port: 1433,
    database: 'Studopraksa',
    options: {
      encrypt: false // use this for Azure SQL Server
    }
  }

  sql.connect(config).then(pool => {
    // connected
    console.log("Connected to the DB")
}).catch(err => {
    console.log("Error while connecting to DB", err)
});

const newUser = {
    username: 'JohnDoe',
    email: 'johndoe@example.com',
    password: 'password'
}

/* sql.connect(config).then(pool => {
    var request = new sql.Request();
    request.input('username', sql.NVarChar(255), newUser.username);
    request.input('email', sql.NVarChar(255), newUser.email);
    request.input('password', sql.NVarChar(255), newUser.password);
    request.query(`INSERT INTO users (username, email, password) VALUES (@username, @email, @password)`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log("User inserted successfully");
        }
    });
}).catch(err => {
    console.log("Error while connecting to DB", err)
}); */


app.use(session({
  secret: 'mysecret', // use a secret string to encrypt the session data
  resave: false,
  saveUninitialized: true
}));


async () => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect('Server=localhost,1433;Database=database;User Id=rpuser;Password=1234;Encrypt=false')
        const result = await sql.query`select * from sales.customers where customer_id = 1`
        console.dir(result)
    } catch (err) {
        // ... error checks
    }
}

app.use(express.static('../Projekt-Dinamicke'))

let users= [{
    email: "w@w",
    password:"password",
    name:"Pero"
}];

app.get('/users', (req, res)=>{
 res.status(200).json(users); 
});

app.get('/info:dynamic', (req, res)=>{
    const { dynamic } = req.params;
    const { key } = req.query;
    console.log(dynamic+" " , key);
    res.status(200).json({info: 'neki text'});
});



app.post('/users', async (req, res) => {
    console.log(req.body.email, req.body.password);
        let temmm = users.find(({email})=>email === req.body.email);
        if(temmm !== undefined){
            console.log("taj email vec postoji u bazi");
            res.status(500).send("That email is already registered in a database");
            return;
        }
        else{
            try{
                const hashedPassword = await bcrypt.hash(req.body.password, 10)
                const  user = {email: req.body.email ,
                password: hashedPassword};
                console.log(user);
                users.push(user);
                console.log(users);
                res.status(201).send();
            }catch{
                res.status(500).send();
            }
        }
        
    
   
});

app.post('/users/login', async (req, res) => {
    console.log("USO");
    const user = users.find(user=> user.email === req.body.email)
    if(user == null){
        return res.status(400).send("Korisnik ne postoji");
    }
   
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
           
            /* req.session.user = {
             id: user.id,
            name: user.name
            }; */
            res.redirect('http://127.0.0.1:5500/home.html');
        }
        else{
            res.send("Not Allowed");
        }
    } catch{
        res.status(500).send();
    }
});


/* app.patch("/updateUser/:id", (req,res)=>{
   
})

app.delete("/deleteUser", (req,res)=>{ 
    })
    
 */
app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server slusa "+ PORT);
    else 
        console.log("error ne moze se spojit na port i error je", error);
})