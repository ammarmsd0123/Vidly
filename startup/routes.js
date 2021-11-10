const genres=require('../routes/genres')
const customers=require('../routes/customers')
const movies=require('../routes/movies')
const rentals=require('../routes/rentals')
const registerUser=require('../routes/register')
const returns=require('../routes/returns')
const auth=require('../routes/auth');
const express=require('express')
const error=require('../middlewares/error')

module.exports=function(app){
    app.use(express.json())
    app.use('/api/genres',genres);
    app.use('/api/customers',customers);
    app.use('/api/movies',movies);
    app.use('/api/rentals',rentals);
    app.use('/api/users',registerUser);
    app.use('/api/returns',returns);
    app.use('/api/auth',auth);
    app.use(error);
}