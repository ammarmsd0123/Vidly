const {customerModel,validateCustomer}=require('../models/customers')
const auth=require('../middlewares/auth')
const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')

router.get('/',async (req,res)=>{
    try{
        const allCustomers= await customerModel.find().sort('name')
            .select({name:1});
        return res.status(200).send(allCustomers)
    }
    catch(err){
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
});

router.post('/',auth, async (req,res)=>{
    try{
        const {error}=validateCustomer(req.body)
        if(error){
            console.log(error.details[0])
            return res.status(400).send(error.details[0].message);
        }
        else{
            const customer=new customerModel({
                id:req.body.id,
                name:req.body.name,
                phone:req.body.phone,
                isGold:req.body.isGold,
            });
            const result=await customer.save();
           return res.status(200).send("Customer added");
        }
        
    }
    catch(err){
        console.log(err.message)
        return res.status(500).send("Something went wrong")
    }

});

router.put('/',auth,async (req,res)=>{

    const {error}=validateCustomer(req.body);
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    try{
        const customer=await customerModel.findOneAndUpdate({id:req.body.id},
            {
                name:req.body.name,
                phone:req.body.phone,
                isGold:req.body.isGold
            }
        );
        console.log(customer)
        if(!customer){
            return res.status(404).send("Customer not found")
        }
        return res.status(200).send("Customer updated")
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Something went wrong")
    }

});

router.delete('/:id',async (req,res)=>{
    try{
        const customer=await customerModel.findOneAndDelete({id:req.params.id});
        if(!customer){
            return res.status(200).send("Invalid id or id doesnot exist");
        }
        return res.status(200).send("Customer deleted");
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send("Something went wrong")
    }

});

module.exports=router;