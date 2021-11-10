const mongoose=require('mongoose')
const Joi=require('joi')

const rentalModel=mongoose.model("rentals",new mongoose.Schema({
    customer:{
        required:true,
        type:new mongoose.Schema({
            name:{
                type:String,
                required:true,
                minlength:1,
                maxlength:255
            },
            phone:{
                type:String,
                required:true,
                minlength:11
            },
            isGold:{
                type:Boolean,
                required:false
            }
        })
    },
    movie:{
        required:true,
        type:new mongoose.Schema({
            title:{
                type:String,
                required:true,
                minlength:3,
                maxlength:255
            },
            // genre:{
            //     type:genreSchema,
            //     required:true
            // },
            // numberInStock:{
            //     type:Number,
            //     required:true,
            // },
            dailyRentalRate:{
                type:Number,
                required:true,
                mon:0
            }
        }),
    },
    dateOut:{
        type:Date,
        required:true,
        default:Date.now
    },
    dateReturn:{
        type:Date,
    },
    rentalFee:{
        type:Number,
        min:0
    }

}));

function validateRental(rental){
    const schema={
        customerId:Joi.objectId().required(),
        movieId:Joi.objectId().required(),
    };
    return result=Joi.validate(rental,schema);
}

exports.rentalModel=rentalModel;
exports.validateRental=validateRental;