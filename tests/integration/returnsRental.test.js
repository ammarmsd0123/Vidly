const {rentalModel}=require('../../models/rentals')
const {userModel}=require('../../models/userModel')
const {movieModel}=require('../../models/movies')
const mongoose=require('mongoose')
const request = require('supertest');
const moment=require('moment')

describe('/api/genres', ()=>{
    let server;  
    let rental;
    let customerId;
    let movieId;
    let user;
    let token;
    let movie;

    beforeEach(async ()=>{
        customerId=mongoose.Types.ObjectId();
        movieId=mongoose.Types.ObjectId();

        user=new userModel();
        user.isAdmin=true;
        token=user.generateAuthToken();

        if(!server)
        server=require('../../index')

        rental=new rentalModel({
            customer:{
                _id:customerId,
                name:"Ammar",
                phone:"12345678909"
            },
            movie:{
                _id:movieId,
                title:"movie1",
                dailyRentalRate:2
            }

        })
        await rental.save();

        movie=new movieModel({
            _id:movieId,
            title:"12345",
            genre:{name:"horror"},
            numberInStock:10,
            dailyRentalRate:2
        })
        await movie.save();

    });
    afterEach(async ()=>{
        await server.close();
        await rentalModel.remove({});
        await movieModel.remove({});
    });
    afterAll(async ()=>{
        await server.close();
    })
    it('it should return 401 for unauthorization',async ()=>{
        const result=await request(server)
            .post('/api/returns')
            .send({customerId,movieId})
        expect(result.status).toBe(401);
    })
    it('it should return 400 for customer Id not provided',async ()=>{
        const result=await request(server)
            .post('/api/returns')
            .set('x-authToken',token)
            .send({movieId})
        expect(result.status).toBe(400);
    })
    it('it should return 400 for movie Id not provided',async ()=>{
        const result=await request(server)
            .post('/api/returns')
            .set('x-authToken',token)
            .send({customerId})
        expect(result.status).toBe(400);
    })
    it('it should return 404 if no rental found',async ()=>{
        await rentalModel.remove({})
        const result=await request(server)
            .post('/api/returns')
            .set('x-authToken',token)
            .send({customerId,movieId})
        expect(result.status).toBe(404);
    })
    it('it should return 400 if request is already processed',async ()=>{
        rental.dateReturn=new Date();
        await rental.save();

        const result=await request(server)
            .post('/api/returns')
            .set('x-authToken',token)
            .send({customerId,movieId})
        expect(result.status).toBe(400);
    })
    it('it should check that date return is set',async ()=>{
        const result=await request(server)
            .post('/api/returns')
            .set('x-authToken',token)
            .send({customerId,movieId})

        const rentalInDB=await rentalModel.findById(rental._id)
        const diff=new Date()-rentalInDB.dateReturn
        expect(diff).toBeLessThan(10*1000);
    })
    it('it should set the rental fee',async ()=>{
        rental.dateOut=moment().add(-7,'days').toDate();
        await rental.save();

        const result=await request(server)
            .post('/api/returns')
            .set('x-authToken',token)
            .send({customerId,movieId})

        const rentalInDB=await rentalModel.findById(rental._id)
        expect(rentalInDB.rentalFee).toBe(14);
    })

    it('it should increment the movie stock',async ()=>{
        const result=await request(server)
            .post('/api/returns')
            .set('x-authToken',token)
            .send({customerId,movieId})

        const movieInDB=await movieModel.findById(movieId)
        expect(movieInDB.numberInStock).toBe(movie.numberInStock+1);
    })
    it('it should return rentals if valid input',async ()=>{
        const result=await request(server)
            .post('/api/returns')
            .set('x-authToken',token)
            .send({customerId,movieId})
            
        const rentalInDB=await rentalModel.findById(rental._id)
        expect(Object.keys(result.body))
            .toEqual(expect.arrayContaining
            (['dateOut','dateReturn','rentalFee','customer','movie']));
    })

})