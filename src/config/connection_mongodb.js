const mongoose = require("mongoose");

const connect = mongoose.createConnection("mongodb://localhost:27017/authenticationJwt");

connect.on("connected",function(){
    console.log("mongodb ::: connect ::: ",this.name);
})
connect.on("disconnected",function(){
    console.log("mongodb ::: disconected ::: ",this.name);
})
connect.on("error",function(){
    console.log("mongodb ::: error ::: ",this.name);
})

process.on("SIGINT",async function(){
    await connect.close();
    process.exit(0);
})
module.exports = connect;
