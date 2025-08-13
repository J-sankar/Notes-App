import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authrouter from './routes/auth.js'
import  dashboardRouter  from './routes/dashboard.js'
import  adminRouter  from './routes/admin.js'
import  connectDB  from './db.js'

dotenv.config()


const app = express()
const port = process.env.PORT ||3000

connectDB()


app.use(cookieParser())
app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL||'http://localhost:5173',
  credentials: true
}));



app.use('/api/auth',authrouter)

app.use('/dashboard', dashboardRouter)

app.use('/admin',adminRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
