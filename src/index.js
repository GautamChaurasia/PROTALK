require('dotenv').config()
require("./database/connection")
const cors = require('cors');
const cookie = require('cookie-parser')
const express = require("express");
const app = express();

const port = process.env.PORT

app.use(cors({credentials:true, origin:["http://localhost:3000"]}));
app.use(express.json());
app.use(cookie());
app.use('/', require("./routers/protalk"));
// app.use('/chat', require("./router/chat"));
// app.use('/conf', require("./router/conference"));

app.get("/", (req, res)=>{
    res.send("Welcome to PROTALK backend !");
});

app.listen(port, ()=>{
    console.log(`PROTALK server up at: http://localhost:${port}`);
});