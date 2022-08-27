const mong = require("mongoose");

const db = process.env.ATLAS_DB_STR;

const conndb = async()=>{
try{
    await mong.connect(db, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    });
    console.log(`Connected to Database successfully`);
    } catch(e){
        console.log(`Could not connect to database`);
        }
};

conndb();