const {rentalModel,validateRental}=require('../models/rentals')
const {customerModel}=require('../models/customers')
const {movieModel,genreModel}=require('../models/movies')
const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')
const Fawn=require('fawn');
const auth=require('../middlewares/auth')

router.post('/',auth, async (req,res)=>{
    try{
        const {error}=validateRental(req.body)
        if(error){
            console.log(error.details[0])
            return res.status(400).send(error.details[0].message);
        }
        else{
            const customer=await customerModel.findById(req.body.customerId);
            if(!customer){return res.status(400).send("Invalid Customer");}

            const movie=await movieModel.findById(req.body.movieId);
            if(!customer){return res.status(400).send("Invalid movie");}

            if(movie.numberInStock===0){return res.status(400).send("Movie not in stock");}

            const rental=new rentalModel({
                customer:{
                    _id:customer._id,
                    name:customer.name,
                    phone:customer.phone,
                    isGold:true
                },
                movie:{
                    _id:movie._id,
                    title:movie.title,
                    dailyRentalRate:movie.dailyRentalRate,
                },

            });
            const result=await rental.save();
            movie.numberInStock--;
            movie.save();

           return res.status(200).send("Rental added");
        }
        
    }
    catch(err){
        console.log(err)
        return res.status(500).send("Something went wrong")
    }

});

router.get('/', async (req,res)=>{
    try{
        const rentals=await rentalModel.find();
        return res.status(200).send(rentals); 
    }
    catch(err){
        console.log(err)
        return res.status(500).send("Something went wrong")
    }

});
module.exports=router;