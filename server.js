const express = require("express");
const app = express();
const PORT = 8080;
const { uuid } = require('uuidv4');
app.use(express.json());
const bcrypt = require('bcrypt');

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
            res.status(500).send("error");
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