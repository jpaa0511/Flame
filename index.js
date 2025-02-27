const express = require('express');

const app = express();
const PORT = 3000;

app.get('/home', (req,res)=> {
   res.send("It's Working") 
});

app.listen(PORT, ()=>{
console.log("Esta ejecutandose por el puerto " + PORT)
});
