const mongoose=require('mongoose')
const Joi=require('joi')

const customerSchema={
    id:{
        type:String,
        required:true,
        minlength:1,
       
    },
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
        required:true
    }
}
const customerModel=mongoose.model('Customers',customerSchema);

function validateCustomer(customer){
    const schema={
        id:Joi.string().min(3).required(),
        name:Joi.string().min(3).required(),
        phone:Joi.string().min(11).required(),
        isGold:Joi.boolean().required()
    };
    return result=Joi.validate(customer,schema);
}

exports.customerModel=customerModel;
exports.validateCustomer=validateCustomer;