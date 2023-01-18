const express = require("express");
const app = express();
const PORT = 8080;
const { uuid } = require('uuidv4');
app.use(express.json());
const bcrypt = require('bcrypt');
const cors = require("cors");
app.use(cors());
const session = require('express-session');
//import connect from './db.js';

app.use(session({
    secret: 'mysecret', // use a secret string to encrypt the session data
    resave: false,
    saveUninitialized: true
  }));
  
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dkrnjic:D10203040@studopraksa.yrg3rpc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

let database;
async function connect(){
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
        database= client.db("test");
    } catch (error) {
        console.log(error);
    } 
}
connect();

let users;
app.get('/users', async(req,res)=>{
    try {
        const movies = await database.collection("collection").find();
        users = await movies.toArray();
        res.status(200).json(users); 
    }
    catch (error) {
        console.log(error);
    }
  /*   finally{
        await client.close();
    } */
  })
 
app.post('/users', async (req, res) => {
    //console.log(req.body.email, req.body.password);
    let doc = await database.collection('collection').find({ email: req.body.email})
    doc = await doc.toArray()
    //console.log(doc);
    if(doc!=""){
        console.log("taj email vec postoji u bazi");
        res.status(500).send("That email is already registered in a database");
        return;
        }
    else{
        try{
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const  user = {email: req.body.email ,
            password: hashedPassword};
            let result = await database.collection('collection').insertOne(user)
            if (result.insertedId){
                console.log("uspjeh registriranja korisnika");
                res.json({"status":"OK", "message":`Item ${req.body.email} saved in DB`})
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
});

app.get('/info:dynamic', (req, res)=>{
    const { dynamic } = req.params;
    const { key } = req.query;
    console.log(dynamic+" " , key);
    res.status(200).json({info: 'neki text'});
});


app.post('/users/login', async (req, res) => {
    let userExist = await database.collection('collection').findOne({ email: req.body.email})
    //console.log(userExist);
    if (userExist){
         try{
            if(await bcrypt.compare(req.body.password, userExist.password)){
                res.redirect('http://127.0.0.1:5500/home.html');
            }
            else{
                console.log("neuspjesan login");
                res.send("Not Allowed");
            }
                
        } 
        catch{
            res.status(500).send();
        }  
        
        }
    else
        return res.status(422).json({ error: "Korisnik ne postoji" });
});

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server slusa "+ PORT);
    else 
        console.log("error ne moze se spojit na port i error je", error);
})

app.use(express.static('../Projekt-Dinamicke'))