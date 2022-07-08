require("dotenv").config();
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const redis = require("../services/user.redis.service.js");
// client.connect().then();
const signAccessToken = (userid)=>{
    
    return new Promise((resolve,reject) => {
        const payload = {
            userid
        }
        const options = {
            expiresIn: process.env.EXPIRE_ACCESS_TOKEN
        }
        jwt.sign(payload,process.env.SECRET_KEY,options,(err,token)=>{
            
            if(err) reject(err);
            resolve(token);
        })
    })
}
const verifyAcessToken = (req,res,next)=>{
    const token = req.body.token || req.query.token || req.headers?.["x-access-token"];
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
            if(err){
                next(createError.Unauthorized());
                return;
            }
            req.decoded = decoded;
            next();
        })
    }else{
        next(createError.Forbidden());
    }
    
}
const signRefreshToken =  async (userid)=>{
    try{
        const payload = {
            userid
        }
        const options = {
            expiresIn: process.env.EXPIRE_REFRESH_TOKEN
        }
        const token = jwt.sign(payload,process.env.SECRET_KEY,options);
        await redis.set(userid,token,{EX:24*60*60})
        return token 

    }catch(err){
        throw err
    }
}
const verifyRefeshToken = async (req,res,next) => {
    try{
        const refreshToken = req.body.refreshToken || req.query.refreshToken || req.headers?.["x-access-refreshtoken"];
        if(!refreshToken){
            next(createError.BadRequest("Refreshtoken badrequest"))
        }
        const isMyrefreshToken = refreshToken === await redis.get(req.body.userid);
        if(!isMyrefreshToken){
            next(createError.BadRequest("Refreshtoken badrequest"))
        }
        const decoded = jwt.verify(refreshToken,process.env.SECRET_KEY);
        req.decoded = decoded;
        next();

    }catch(err){
        next(err);
    }
}
module.exports = {
    signAccessToken,
    verifyAcessToken,
    signRefreshToken,
    verifyRefeshToken
};


