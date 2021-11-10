const {userModel}=require('../models/userModel')
const bcrypt=require('bcrypt')
const express=require('express')
const router=express.Router();
const jwt=require('jsonwebtoken')
const Joi=require('joi')
const config=require('config')

router.post('/', async (req,res)=>{
    try{
        const {error}=validate(req.body)
        let user=await userModel.findOne({email:req.body.email});
        if(!user){return res.status(400).send("Invalid email or password");}
        if(error){
            console.log(error.details[0])
            return res.status(400).send(error.details[0].message);
        }
        
        const validPassword=await bcrypt.compare(req.body.password,user.password);
        if(!validPassword){
            return res.status(400).send("Invalid email or password");
        }
        const token=user.generateAuthToken();
        return res.status(200).send(token);
        
    }
    catch(err){
        console.log(err.message)
        return res.status(500).send("Something went wrong")
    }

});
function validate(req){
    const schema={
        email:Joi.string().min(3).max(255).email().required(),
        password:Joi.string().min(5).required(),
    };
    return result=Joi.validate(req,schema);
}
module.exports=router;