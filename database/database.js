const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dkrnjic:zqmJ6m2ZbWQFHnG@studopraksa.yrg3rpc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
let database;

const connectToServer=  async()=>{
    try{
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
        database= client.db("test");
        } catch (error) {
        console.log(error);
        } 
} 

const getUri =()=>{    
    return uri;
}
const getCollectionSession =()=>{
    return "MySessions";
}
const getDb = ()=>{
return database;
}
module.exports = {getUri, getCollectionSession, connectToServer, getDb };

