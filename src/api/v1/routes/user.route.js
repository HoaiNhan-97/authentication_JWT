const express = require("express");
const route = express.Router();
const userController = require("../controlers/user.controler.js")
const validationUser = require("../validations/user.validation.js");
const token = require("../helpers/token.helper.js")

route.post("/register",validationUser.register,userController.register);
route.post("/login", validationUser.login,userController.login);
route.post("/refreshtoken",validationUser.refreshToken,token.verifyRefeshToken,userController.refreshToken)
// // route require token
route.use(token.verifyAcessToken);
route.get("/",userController.list)


module.exports =route;