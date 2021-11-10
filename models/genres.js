const mongoose=require('mongoose')
const Joi=require('joi')

const genreSchema={
    // id:{
    //     type:String,
    //     required:true,
    //     minlength:1,
    //     maxlength:255
    // },
    title:{
        type:String,
        required:true,
        minlength:5,
        maxlength:10
    },
    IssueDate:{
        type:Date,
        default:Date.now
    }
}

const genreModel=mongoose.model('genres',genreSchema);

function validateGenre(movie){
    const schema={
        title:Joi.string().min(5).max(10).required()
    };
    return result=Joi.validate(movie,schema);
}

exports.genreModel=genreModel;
exports.validateGenre=validateGenre;
