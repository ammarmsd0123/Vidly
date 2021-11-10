const {userModel,validateUser}=require('../models/userModel')
const bcrypt=require('bcrypt')
const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')
const Fawn=require('fawn');
const _=require('lodash');
const jwt=require('jsonwebtoken')
const auth=require('../middlewares/auth')

router.get('/me',auth,async (req,res)=>{
    const user=await userModel.findById(req.user._id).select('-password');
    res.send(user)
})

router.post('/',auth, async (req,res)=>{
    try{
        const {error}=validateUser(req.body)
        let user=await userModel.findOne({email:req.body.email});
        if(user){return res.status(400).send("User already exists");}
        if(error){
            console.log(error.details[0])
            return res.status(400).send(error.details[0].message);
        }
        user=new userModel(_.pick(req.body,['name','email','password']));
        const salt=await bcrypt.genSalt(10)
        user.password=(await bcrypt.hash(user.password,salt)).toString();
        const result=await user.save();
        
        const token=user.generateAuthToken();
        return res.header('x-authToken',token).status(200).send("user added");
        
    }
    catch(err){
        console.log(err.message)
        return res.status(500).send("Something went wrong")
    }

});

module.exports=router;