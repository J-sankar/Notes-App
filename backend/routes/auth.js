import express from 'express'
import {login, registerNewUser,refresh, logout} from '../controllers/authControllers.js'
import { verifyRefreshToken } from '../middlewares/auth.middleware.js'


 const authrouter = express.Router()
authrouter.post('/register', registerNewUser)
authrouter.post('/login', login)
authrouter.post('/refresh',verifyRefreshToken,refresh)
authrouter.post('/logout',verifyRefreshToken,logout)


export default authrouter