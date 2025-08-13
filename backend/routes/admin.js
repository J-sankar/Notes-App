import { verifyAdmin,verifyAccessToken } from "../middlewares/auth.middleware.js";
import express from "express";

 const adminRouter = express.Router()
adminRouter.use(verifyAccessToken,verifyAdmin)

adminRouter.get('/dashboard',(req,res)=>{
    console.log("Admin dashboard connected")
    return res.status(200).json("Welcome Admin")
    
})
export default adminRouter