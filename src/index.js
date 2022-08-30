require('dotenv').config()
require("./database/connection")
const cors = require('cors');
const cookie = require('cookie-parser')
const express = require("express");
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)

const port = process.env.PORT

app.use(cors({credentials:true, origin:["*"]}));
app.use(express.json());
app.use(cookie());
app.use('/', require("./routers/protalk"));
// app.use('/chat', require("./routers/chat"));
app.use('/conf', require("./routers/conference")(io));

app.get("/", (req, res)=>{
    res.send("Welcome to PROTALK backend !");
});

server.listen(port, ()=>{
    console.log(`PROTALK server up at: http://localhost:${port}`);
});