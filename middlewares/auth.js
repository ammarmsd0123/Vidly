const jwt=require('jsonwebtoken')
module.exports=function(req,res,next){
    const token=req.header('x-authToken')
    if(!token){
        return res.status(401).send('Access Denied, Invalid token')
    }
    try{
        const decoded=jwt.verify(token,"config.get('jwtPrivateKey')");
        req.user=decoded;
        next();
    }
    catch(ex){
        return res.status(400).send('Invalid Token')
    }
}