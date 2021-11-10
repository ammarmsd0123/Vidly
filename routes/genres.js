const {genreModel,validateGenre}=require('../models/genres')
const auth=require('../middlewares/auth')
const admin=require('../middlewares/admin')
const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')
const asyncMiddleware=require('../middlewares/async')
const validateObjectId=require('../middlewares/validateObjectId')

router.get('/',asyncMiddleware(async (req,res)=>{
        const allGenres= await genreModel.find().select({title:1});
        return res.status(200).send(allGenres)
}));

router.get('/:id',validateObjectId,asyncMiddleware(async (req,res)=>{
    const genre= await genreModel.findById(req.params.id).select({title:1});
    if(genre)
        return res.status(200).send(genre)
    else
        return res.status(404).send("genre not found")
}));

router.post('/',[auth,admin], async (req,res)=>{
    try{
        const {error}=validateGenre(req.body)
        if(error){
            console.log(error.details[0])
            return res.status(400).send(error.details[0].message);
        }
        else{
            const genre=new genreModel({
                title:req.body.title,
            });
            const result=await genre.save();
           return res.status(200).send(genre);
        }
        
    }
    catch(err){
        console.log(err.message)
        return res.status(500).send("Something went wrong")
    }

});

router.put('/',auth,async (req,res)=>{

    const {error}=validateGenre(req.body);
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    try{
        const genre=await genreModel.findOneAndUpdate({id:req.body.id},{title:req.body.title}
        );

        if(!genre){
            return res.status(404).send("genre not found")
        }
        return res.status(200).send("genre updated")
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Something went wrong")
    }

});

router.delete('/:id',async (req,res)=>{
    try{
        const genre=await genreModel.findOneAndDelete({id:req.params.id});
        if(!genre){
            return res.status(200).send("Invalid id or id doesnot exist");
        }
        return res.status(200).send("genre deleted");
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send("Something went wrong")
    }

});

module.exports=router;