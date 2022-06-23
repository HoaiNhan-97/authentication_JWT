const express = require("express");
const createError = require("http-errors");

const app = express();

// conect monogodb

require("./config/connection_mongodb.js");

// User router

const userRouter = require("./api/v1/routes/user.route.js");


app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.use("/api/v1/user",userRouter);
app.get("/",(rep,res)=>{
    console.log("a:::: ",a)
    res.json("hello");
})
app.use((req,res,next)=>{
    next(createError.NotFound());
})
app.use((err,rep,res,next) => {
    const status = err.status || 500;
    const message = err.message || "some thing wrong";
    res.json({status,message})
})


module.exports = app;