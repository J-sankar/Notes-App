import app from "./app.js";
import express from 'express'
import dotenv from 'dotenv'
import  connectDB  from './db.js'

dotenv.config()
connectDB()
const port = process.env.PORT ||3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})