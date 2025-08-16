import { login } from "../controllers/authControllers.js";
import { User } from "../models/userModels.js";
import { createAccessToken, createRefreshToken } from "../utils/tokens.js";
import mongoose from "mongoose";
import request from 'supertest'
import app from '../app.js'



jest.mock('../utils/tokens.js')
jest.mock('../models/userModels.js')

const mockUser = {
    email: "Testemail@gmail.com",
    password: "123456",
    refreshTokens: [],
    status: 'active',
    passwordValidityCheck: jest.fn().mockResolvedValue(true),
    save: jest.fn().mockResolvedValue(true)

}

afterAll(async () => {
    await mongoose.connection.close()
})

describe("POST /api/auth/login", () => {

    test('should return 400 error if email or password is missing', async () => {
        res = await request(app).post('/api/auth/login').send({ password: '', email: '' })
        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Please provide all data" })
    },

        test("Should return 404 error if email is not registered", async () => {

            User.findOne.mockResolvedValue(null)
            const res = await request(app).post('/api/auth/login').send({ password: '123456', email: 'Testemail@gmail.com' })
            expect(res.status).toBe(404)
            expect(res.body).toEqual({ message: "Email not registered" })
        }),

        test("Should return 404 error if password is incorrect", async () => {
            await User.findOne.mockResolvedValue(mockUser)
            mockUser.passwordValidityCheck.mockResolvedValue(false)
            const res = await request(app).post('/api/auth/login').send(mockUser)
            expect(res.status).toBe(404)
            expect(res.body).toEqual({ message: "Password is incorrect" })
        }),
        test("Should return 403 if blocked by admin", async () => {
            const blockedUser = { ...mockUser, status: "blocked", passwordValidityCheck: jest.fn().mockResolvedValue(true) }
            User.findOne.mockResolvedValue(blockedUser)
            res = await request(app).post('/api/auth/login').send({ email: 'Testemail@gmail.com', password: '123456' })
            expect(res.status).toBe(403)
            expect(res.body).toEqual({ message: 'Blocked by admin' })

        }),
        test("Should return 200 if successfull login", async () => {
            await User.findOne.mockResolvedValue(mockUser)
            mockUser.passwordValidityCheck.mockResolvedValue(true)
            createAccessToken.mockReturnValue("mockaccesstoken")
            createRefreshToken.mockReturnValue("mockrefreshtoken")

            const res = await request(app).post('/api/auth/login').send({ email: 'Testemail@gmail.com', password: '123456' })
            expect(res.status).toBe(200)

            expect(res.body).toEqual({accessToken:'mockaccesstoken', message: "Login Successfull" })
            
            expect(mockUser.save).toHaveBeenCalled()
            
            expect(mockUser.refreshTokens).toContain('mockrefreshtoken')

            // cookie set correctly
            expect(res.headers['set-cookie'][0]).toMatch(/refreshToken=mockrefreshtoken/)

        })
    )
})