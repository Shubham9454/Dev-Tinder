const express = require('express');

const app = express();

const port = 3000;

// --> it matches the user's request with all HTTP Method's API call
// app.use('/',(req , res) =>{
//     res.send("Hello World");
// });

// it matches with only HTTP get method's API call
app.get("/user" , (req , res) =>{

    res.send({firstName: "Shubham", lastName: "Yadav", PhoneNo: 9455443430});
});

app.get(/f+a/ , (req , res) =>{
    console.log(req.params);
    res.send({firstName: "Shubham", lastName: "kr", PhoneNo: 9455434417});
});

// dynamic routing 
app.get("/user/:userid/:password" , (req , res) => {
    console.log(req.params);
    res.send("Params are used in URL");
})

// post method
app.post("/user" , (req , res) =>{

    res.send("Data is saved successfully");
});

// delete method
app.delete("/user" , (req , res) =>{

    res.send("Data is deleted successfully");
});


 
app.listen(3000, ()=>{
    console.log("Server is listening you at Port No.",port);
});