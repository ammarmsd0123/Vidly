const {movieModel,genreModel,validateMovie}=require('../models/movies')
const auth=require('../middlewares/auth')
const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')

router.post('/',auth, async (req,res)=>{
    try{
        const {error}=validateMovie(req.body)
        if(error){
            console.log(error.details[0])
            return res.status(400).send(error.details[0].message);
        }
        else{
            const movie=new movieModel({
                id:req.body.id,
                title:req.body.title,
                genre:new genreModel({name:req.body.genre}),
                numberInStock:req.body.numStock,
                dailyRentalRate:req.body.dailyRent

            });
            const result=await movie.save();
           return res.status(200).send("movie added");
        }
        
    }
    catch(err){
        console.log(err)
        return res.status(500).send("Something went wrong")
    }

});

router.get('/', async (req,res)=>{
    try{
        const movies=await movieModel.find();
        return res.status(200).send(movies); 
    }
    catch(err){
        console.log(err)
        return res.status(500).send("Something went wrong")
    }

});

router.put('/',auth,async (req,res)=>{

    const {error}=validateMovie(req.body);
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    try{
        const genre=await genreModel.find({name:req.body.genre});
        if(!genre){
            return res.status(400).send("genre Invalid")
        }
        const movie=await movieModel.findOneAndUpdate({id:req.body.id},{
            title:req.body.title,
            genre:{
                name:req.body.genre
            },
            numStock:req.body.numStock,
            dailyRent:req.body.dailyRent,
        });

        if(!movie){
            return res.status(404).send("movie not found")
        }
        return res.status(200).send("movie updated")
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send("Something went wrong")
    }

});

router.delete('/:id',async (req,res)=>{
    try{
        const movie=await movieModel.findOneAndDelete({id:req.params.id});
        if(!movie){
            return res.status(200).send("Invalid id or id doesnot exist");
        }
        return res.status(200).send("movie deleted");
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send("Something went wrong")
    }

});
module.exports=router;