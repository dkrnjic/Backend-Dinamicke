const express = require("express");
const app = express();
const PORT = 8080;
const { uuid } = require('uuidv4');
app.use(express.json());
const bcrypt = require('bcrypt');

let users= [
    {
	"email": "d@d",
	"password": "test"
    }   
];

app.get('/users', (req, res)=>{
    res.json(users);
});

app.post('/users', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const  user = {email: req.body.email ,
        password: hashedPassword};
        users.push(user);
        res.status(201).send();
    }catch{
        res.status(500).send();
    }
   
});

app.post('/users/login', async (req, res) => {
    const user = users.find(user=> user.email = req.body.email)
    if(user == null){
        return res.status(400).send("Korisnik ne postoji");
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send("Success");
        }
        else{
            res.send("Not Allowed");
        }
    } catch{
        res.status(500).send();
    }
});


app.patch("/updateUser/:id", (req,res)=>{
   
})

app.delete("/deleteUser", (req,res)=>{ 
    })
    

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server slusa "+ PORT);
    else 
        console.log("error ne moze se spojit na port i error je", error);
})