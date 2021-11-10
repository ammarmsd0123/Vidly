const mongoose=require('mongoose')
const Joi=require('joi')
const passwordComplexity = require("joi-password-complexity");
const any = require('joi/lib/types/any');
const jwt=require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3,
        maxlength:255
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:5,
        maxlength:255
    },
    isAdmin:Boolean
});
userSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id: this._id,isAdmin:this.isAdmin},"config.get('jwtPrivateKey')")
    return token;
}
const userModel=mongoose.model('users',userSchema);

function validateUser(user){
    const schema={
        name:Joi.string().min(3).required(),
        email:Joi.string().min(3).max(255).email().required(),
        password:Joi.string().min(5).required(),
    };
    return result=Joi.validate(user,schema);
}

exports.userModel=userModel;
exports.validateUser=validateUser;
