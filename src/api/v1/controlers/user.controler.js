// dotenv
require("dotenv").config();
// module
const {
    _User,
    // userTest2
} = require("../modules");
// error
const createError = require("http-errors");
// hash password bcrypt
const bcrypt = require("bcrypt");
// jsonwebtoken
const token = require("../helpers/token.helper.js");

const redis = require("../services/user.redis.service.js");

const register = async (req,res,next) =>{
    try{
       
        const {username,password} = req.body;
        // find exist user
        const exitUser =  await _User.findOne({username})
        if(exitUser){
            // if user exist, send message to client
            next(createError.Conflict(`${username} is already have registed`));
            return;
        }
        // hash password 
        const salt = await bcrypt.genSalt(8);
        const hashPassword = await bcrypt.hash(password,salt)
        // create user
        const newUserJwt = await _User.create({username,password:hashPassword});
        res.json({staus:200,element:newUserJwt});

    }catch(err){
        next(err)
    }
    
}

const login = async (req,res,next) =>{
    try {
        const {username, password} = req.body;
        // find user
        const user =  await _User.findOne({username})
        // if not found
        if(!user){
            // if user exist, send message to client
            next(createError.NotFound(`${username} is not found`));
            return;
        }
        // check password 
        const isPassword = await bcrypt.compare(password,user.password);
        // wrong password
        if(!isPassword){
            // isPassword === false, send message to client
            next(createError.Forbidden(`username or password is invalid`));
            return;
        }
        // genrate access and refresh token
        const accesstoken = await token.signAccessToken(user._id.toString())
        const refreshToken = await token.signRefreshToken(user._id.toString())
    
    
        res.json({status:200,element:user,accesstoken,refreshToken})
    }catch(err){
        next(err);
    }
}
const list = async (req,res,next) => {
    try{
        const list = await _User.find({});
        res.json(list)
    }catch(err){
        next(err)
    }
}
const refreshToken = async (req,res,next) => {
    try{
        const {userid} = req.body;
        if(userid != req.decoded.userid){
            next(createError.BadRequest("Refreshtoken badrequest"))
        }
        const accesstoken = await token.signAccessToken(userid)
        const refreshToken = await token.signRefreshToken(userid)
    
    
        res.json({status:200,userid,accesstoken,refreshToken})
    }catch(err){
        next(err);
    }
}
const logout  = async (req,res,next) => {
    try{
        await redis.del(req.body.userid)
        res.json({status:200,message:"logout"})
    }catch(err){next(err)}
}
module.exports = {
    register,
    login,
    list,
    refreshToken,
    logout
}