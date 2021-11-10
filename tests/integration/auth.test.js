const request = require('supertest');
const {genreModel}=require('../../models/genres')
const {userModel}=require('../../models/userModel')

describe('auth middleware ', ()=>{
    let token;
    let server;

    beforeEach(()=>{
        server=require('../../index')
        user=new userModel();
        user.isAdmin=true;
        token=user.generateAuthToken();
    });
    afterEach(async ()=>{
        await genreModel.remove({})
        await server.close();
    });

    afterAll(async ()=>{
        await server.close();
    })

    const exec= async ()=>{
       res=await request(server)
        .post('/api/genres')
        .set('x-authToken',token)
        .send({title:"genre1"})

        return res;
    }

    it('should return 401 if no token provided',async ()=>{
        token='';
        const res=await exec();
        expect(res.status).toBe(401);
    })

    it('should return 400 if no token is invalid',async ()=>{
        token='a'
        const res=await exec();
        expect(res.status).toBe(400);
    })

    it('should return 200 if token is valid',async ()=>{
        const res=await exec();
        expect(res.status).toBe(200);
    })

})