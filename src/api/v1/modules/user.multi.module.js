const mongoose = require("mongoose");

const schema = mongoose.Schema;



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

module.exports = userSchema;