const express = require('express');

const app = express();

const port = 3000;

app.use('/testapipath',(req , res) =>{
    res.send("Hello World");
});

app.listen(3000, ()=>{
    console.log("Server is listening you at Port No.",port);
});