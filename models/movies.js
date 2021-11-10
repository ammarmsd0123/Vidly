const mongoose=require('mongoose')
const Joi=require('joi')

const genreSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3,
        maxlength:255,
        enum : ['horror','romance','comedy','action']
    }
});
const genreModel=mongoose.model("genre",genreSchema);

const movieModel=mongoose.model("movies",new mongoose.Schema({
    id:{
        type:String,
        minlength:1,
        maxlength:255
    },
    title:{
        type:String,
        required:true,
        minlength:3,
        maxlength:255
    },
    genre:{
        type:genreSchema,
        required:true
    },
    numberInStock:{
        type:Number,
        required:true,
    },
    dailyRentalRate:{
        type:Number,
        required:true,
    }
}));


function validateMovie(movie){
    const schema={
        // id:Joi.string().min(3).required(),
        title:Joi.string().min(3).required(),
        genre:Joi.string().min(3).required(),
        numStock:Joi.number(),
        dailyRent:Joi.number(),
    };
    return result=Joi.validate(movie,schema);
}

exports.movieModel=movieModel;
exports.genreModel=genreModel;
exports.validateMovie=validateMovie;
