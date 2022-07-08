const Joi = require("joi");
const registerSchema = Joi.object({
    username: Joi.string()
    .required()
    .messages({
        "any.required":"Username is required",
        "string.empty" : "Username is not allow empty" 
    }),
    // email:Joi.string()
    // .email()
    // .pattern(new RegExp("gmail.com$"))
    // .required()
    // .messages({
    //     "any.required":"Email is required",
    //     "string.empty":"Email is not allowed to be empty",
    //     "string.pattern.base":"Email only accept gmail.com",
    // }),

    password: Joi.string()
    .min(8)
    .required()
    .messages({
        "any.required":"Password is required",
        "string.min":"password length must be at least {#limit} characters long ",
        "string.pattern.base":"Password must be at least one uppercase letter, one lowercase letter, one number and one special character"
    })
    .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])")),
    confirm_password: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .messages({ 
        "any.required":"{#label} is required",
        'any.only': '{{#label}} does not match' 
    })
    

})
/* 
"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"

This regex will enforce these rules:
    At least one upper case English letter, (?=.*?[A-Z])
    At least one lower case English letter, (?=.*?[a-z])
    At least one digit, (?=.*?[0-9])
    At least one special character, (?=.*?[#?!@$%^&*-])
    Minimum eight in length .{8,}$
*/

const loginSchema = Joi.object({
    username: Joi.string()
    .required()
    .messages({
        "any.required":"Username is required",
        "string.empty" : "Username is not allow empty" 
    }),
    password: Joi.string()
    .min(8)
    .required()
    .messages({
        "any.required":"Password is required",
        "string.empty" : "Password is not allow empty" ,
        "string.min":"password length must be at least {#limit} characters long ",
        "string.pattern.base":"Password must be at least one uppercase letter, one lowercase letter, one number and one special character"
    })
    .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])")),
})


const refreshTokenSchema = Joi.object({
    userid: Joi.string()
    .required()
    .messages({
        "any.required":"userid is required",
        "string.empty" : "userid is not allow empty" 
    })
})
module.exports = {registerSchema,loginSchema,refreshTokenSchema}