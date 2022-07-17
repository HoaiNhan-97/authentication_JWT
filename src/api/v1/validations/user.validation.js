const createError = require("http-errors")
const { registerSchema, loginSchema, refreshTokenSchema,logoutSchema} = require("./schemas/user.schema.js");
const register = async (req,res,next) => {
    try{
        await registerSchema.validateAsync(req.body)
        next();
    }catch(err){
        next(createError.BadRequest(err.details[0].message));
    }
};
const login = async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(createError.BadRequest(err.details[0].message));
  }
};
const refreshToken = async (req,res,next) => {
    try{
        await refreshTokenSchema.validateAsync(req.body)
        next();
    }catch(err){
        next(createError.BadRequest(err.details[0].message))
    }
}

const logout = async (req,res,next) => {
  try{
      await logoutSchema.validateAsync(req.body)
      next();
  }catch(err){
      next(createError.BadRequest(err.details[0].message))
  }
}
module.exports = { register, login,refreshToken,logout};
