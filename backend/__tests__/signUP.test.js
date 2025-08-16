import mongoose from "mongoose";

import app from "../app";
import request from 'supertest'
import { User } from "../models/userModels";


beforeAll(async () => {
    await mongoose.disconnect()
  await mongoose.connect("mongodb://localhost:27017/noteAPP_test");
});

// Clean the DB before each test
beforeEach(async () => {
  await User.deleteMany();
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Sign up a new user", ()=>{
    test("should return 400 if no data provided",async ()=>{
        const res = await request(app).post('/api/auth/register').send({name: '', email:'', phone:'',password:'', username:''})

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Please provide all data" })



    }),

    test("should return 409 if email already exists",async ()=>{
        const testUser = new User({name: 'Test User 1', email:'testuser1@gmail.com', phone:'0123456789',password:'12345678', username:'tester'})
        await testUser.save()
        const res = await request(app).post('/api/auth/register').send({name: 'Test User', email:'testuser1@gmail.com', phone:'0123456789',password:'123456', username:'tester'})

        expect(res.status).toBe(409)
        expect(res.body).toEqual({message: "Email already exists" })

    }),
    test("should return 409 if username already exists",async ()=>{
        const testUser = new User({name: 'Test User 1', email:'testuser@gmail.com', phone:'0123456789',password:'12345678', username:'tester'})
        await testUser.save()
        const res = await request(app).post('/api/auth/register').send({name: 'Test User ', email:'testuser1@gmail.com', phone:'0123456789',password:'1234578', username:'tester'})

        expect(res.status).toBe(409)
        expect(res.body).toEqual({message: "username already exists" })

    }),
     test("should return 201 if new user created",async ()=>{
        const testUser1 = {name: 'Test User 1', email:'testuser1@gmail.com', phone:'0123456789',password:'1234578', username:'tester1'}
        const testUser = new User({name: 'Test User', email:'testuser@gmail.com', phone:'0123456789',password:'12345678', username:'tester'})
        await testUser.save()
        const res = await request(app).post('/api/auth/register').send(testUser1)

        expect(res.status).toBe(201)
        expect(res.body).toEqual({ message: "New user registered" ,data:{name:testUser1.name,username:testUser1.username}})

    })
     
})