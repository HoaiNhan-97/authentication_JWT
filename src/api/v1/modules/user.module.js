const mongoose = require("mongoose");

// const jwtDB = require("../../../config/connection_mongodb.js");
const schema = mongoose.Schema; 

const userSchema = new schema({
    username : {
        type:String,
        lowercase:true,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
    }
})

module.exports = mongoose.model("user",userSchema);