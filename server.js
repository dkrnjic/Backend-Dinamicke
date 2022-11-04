const express = require("express");
const app = express();
const PORT = 8080;

let n1 = 0, n2 = 1, nextTerm;
fibo = function(number){   
    n2=1,n1=0;    
    for (let i = 1; i <= number; i++) {
        nextTerm = n1 + n2;
        n1 = n2;
        n2 = nextTerm;
    }
    
return n1;
}
app.get('/:id', (req, res)=>{
    let broj =0;
    broj = fibo(1* req.params.id)
    res.send(broj+""); 
    
});
app.post('/api', (req, res) => {
    console.log("POST Request Called for /api endpoint")
    res.send("POST Request Called")
 })
/* app.get('/banana', (req, res)=>{
    res.status(200);
    res.send("evo banana2"); 
}); */
  

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server slusa "+ PORT);
    else 
        console.log("error ne moze se spojit na port i error je", error);
})