const mongoose = require("mongoose");

function newConnection(uri){
    const connect = mongoose.createConnection(uri);
    connect.on("connected",function(){
        console.log("Mongodb ::: connect ::: ",this.name);
    })
    connect.on("disconnected",function(){
        console.log("Mongodb ::: disconnected ::: ",this.name);
    })
    connect.on("error",function(){
        console.log("Mongodb ::: error ::: ",this.name);
    })

    return connect;
}

const mongoTestDabase = newConnection(process.env.URI_MONGODB_DB1);
// const mongoUsersDabase = newConnection(process.env.URI_MONGODB_DB2);

module.exports = {
    mongoTestDabase,
    // mongoUsersDabase
};
