const request = require('supertest');
const {genreModel}=require('../../models/genres')
const {userModel}=require('../../models/userModel')
const mongoose=require('mongoose')

let server;
describe('/api/genres', ()=>{
    
    beforeEach(()=>{server=require('../../index')});
    afterEach(async ()=>{
        await server.close();
        await genreModel.remove({})
    });

    afterAll(async ()=>{
        await server.close();
    })
    describe('GET /',()=>{
        it('Should return all genres',async ()=>{
            await genreModel.collection.insertMany([
                {title:'genre1'},
                {title:'genre2'},
            ])
            const res=await request(server).get('/api/genres')
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g=>g.title==='genre1')).toBeTruthy();
            expect(res.body.some(g=>g.title==='genre2')).toBeTruthy();
        })

        it('Should return specific genre',async ()=>{
            const genre= new genreModel({title:'genre3'})
            await genre.save();
            const res=await request(server).get('/api/genres/'+genre._id)

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('title',genre.title);
        })

        it('Should return 404 error on invalid id',async ()=>{
            const res=await request(server).get('/api/genres/1')
            expect(res.status).toBe(404);
        })

        it('Should return 404 error if genre with given id doesnot exist',async ()=>{
            const id=mongoose.Types.ObjectId();
            const res=await request(server).get('/api/genres/'+id)
            expect(res.status).toBe(404);
        })
    })

    describe('POST /',()=>{
        it('should return 401 on user not login in',async ()=>{
            const res=await request(server)
                .post('/api/genres')
                .send({title:'genre5'})
    
            expect(res.status).toBe(401);
        })

        it('should return 403 if user is not an admin',async ()=>{
            const token=new userModel().generateAuthToken();
            const res=await request(server)
                .post('/api/genres')
                .set('x-authToken',token)
                .send({title:'genre5'})
    
            expect(res.status).toBe(403);
        })

        it('should return 400 if genre is less than 5 characters',async ()=>{
            let user=new userModel();
            user.isAdmin=true;
            const token=user.generateAuthToken();
            const res=await request(server)
                .post('/api/genres')
                .set('x-authToken',token)
                .send({title:'1234'})
            expect(res.status).toBe(400);
        })

        it('should return 400 if genre is more than 10 characters',async ()=>{
            let user=new userModel();
            user.isAdmin=true;
            const token=user.generateAuthToken();

            const title=new Array(12).join('a');  //long input
            const res=await request(server)
                .post('/api/genres')
                .set('x-authToken',token)
                .send({title:title})
            expect(res.status).toBe(400);
        })

        it('should save the genre if its valid title',async ()=>{
            let user=new userModel();
            user.isAdmin=true;
            const token=user.generateAuthToken();
            const res=await request(server)
                .post('/api/genres')
                .set('x-authToken',token)
                .send({title:'12345'})

            const genre=await genreModel.find({title:"12345"})
            expect(genre).not.toBeNull();
        })

        it('should return the genre if its valid title',async ()=>{
            let user=new userModel();
            user.isAdmin=true;
            const token=user.generateAuthToken();
            const res=await request(server)
                .post('/api/genres')
                .set('x-authToken',token)
                .send({title:'12345'})

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('title','12345');
        })
    })
})
