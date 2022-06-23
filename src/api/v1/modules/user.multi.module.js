const mongoose = require("mongoose");

const schema = mongoose.Schema;

const {mongoTestDabase,mongoUsersDabase} = require("../../../config/connection_multi_mongodb.js");

const userSchema = new schema({
    username:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
})
module.exports = {
    userTest1: mongoTestDabase.model("user",userSchema),
    userTest2: mongoTestDabase.model("user",userSchema)
}