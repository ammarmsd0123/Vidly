const {userModel}=require('../../../models/userModel')
const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')

describe('generateAuthToken',()=>{
    it('Should generate jwt',()=>{
        const payload={
            _id:new mongoose.Types.ObjectId().toHexString(),
            isAdmin:true
        }
        const user=new userModel(payload)
        const token=user.generateAuthToken();
        const decoded=jwt.verify(token,"config.get('jwtPrivateKey')")

        expect(decoded).toMatchObject(payload)
    });
});