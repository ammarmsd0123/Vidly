const auth=require('../../../middlewares/auth')
const {userModel}=require('../../../models/userModel')
const mongoose=require('mongoose')

describe('auth middleware',()=>{
    it('Should populate user.req with valid jwt',()=>{
        const payload={
            _id:new mongoose.Types.ObjectId().toHexString(),
            isAdmin:true
        }
        const user=new userModel(payload)
        const token=user.generateAuthToken();
        
        const req={
            header:jest.fn().mockReturnValue(token)
        }
        const res={}
        const next=jest.fn();

        auth(req,res,next)
        expect(req.user).toMatchObject(payload)
    });
});