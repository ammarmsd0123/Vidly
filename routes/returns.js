const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')
const {rentalModel}=require('../models/rentals')
const {movieModel}=require('../models/movies')
const auth=require('../middlewares/auth')
const moment=require('moment')

router.post('/',auth,async (req,res)=>{
    if(!req.body.customerId){return res.status(400).send("Customer Id not Provided")}
    if(!req.body.movieId){return res.status(400).send("movieId not Provided")}
    
    const rental=await rentalModel.findOne({
        'customer._id':req.body.customerId,
        'movie._id':req.body.movieId
    }) 

    if(!rental){return res.status(404).send("Rental not found")}
    if(rental.dateReturn){return res.status(400).send("Request is already processed")}
    if(rental){
        rental.dateReturn=new Date();
        const rentalDays=moment().diff(rental.dateOut,'days')
        rental.rentalFee=rentalDays * rental.movie.dailyRentalRate 
        await rental.save();

        await movieModel.updateOne({_id:rental.movie._id},{
            $inc:{numberInStock:1}
        });
        return res.status(200).send(rental)
    }
});

module.exports=router;