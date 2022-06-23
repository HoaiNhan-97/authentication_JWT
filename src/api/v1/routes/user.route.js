const express = require("express");

const route = express.Router();
const _Userjwt = require("../modules/user.module.js");
// const {userTest1,userTest2} = require("../modules/user.multi.module.js");

route.post("/register", async (req,res,next) =>{
    try{
        const newUserJwt = await _Userjwt.create(req.body);
        // const newUserTest1 = new userTest1(req.body);
        // const newUserTest2 = new userTest2(req.body);
        // await newUserJwt.save();
        // await newUserTest1.save();
        // await newUserTest2.save();
        res.json(newUserJwt);

    }catch(err){
        next(err)
    }
    
})
module.exports =route;