const winston=require('winston')
// require('winston-mongodb')
const { exitOnError } = require('winston');

module.exports=function(){
    winston.exceptions.handle(
        new winston.transports.Console({colorize:true,prettyPrint:true}),
        new winston.transports.File({filename:'logfile.log'})
    );
    process.on('unhandledRejection',(ex)=>{
        throw ex;
    })
}
// throw new Error('Error during startup')
// const p= Promise.reject(new Error('rejected promise'))
// p.then(()=>console.log('done'))

// winston.add(new winston.transports.File({filename:'logfile.log'}));
// winston.add(new winston.transports.MongoDB({
//     db:'mongodb://localhost/Vidly'
// }));
// process.on('uncaughtException',(ex)=>{
//     console.log("uncaught Exception occured");
//     winston.error(ex.message,ex)
// })
//replaced by bottom..