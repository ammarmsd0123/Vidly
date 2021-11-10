const express=require('express')
const app=express();
const Fawn=require('fawn');

require('./startup/logging')()              //logging function
require('./startup/routes')(app)           //routes function
require('./startup/db')()                 //db function
require('./startup/config')()            //logging function
require('./startup/validation')()       //validating function

const port=process.env.port || 3000
const server=app.listen(port,()=>{
    console.log(`Connected to server ${port}`);
});

module.exports=server;

