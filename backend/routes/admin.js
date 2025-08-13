import express from "express";
import { verifyAdmin,verifyAccessToken } from "../middlewares/auth.middleware.js";
import { displayItems } from "../controllers/adminControllers.js";

 const adminRouter = express.Router()
adminRouter.use(verifyAccessToken,verifyAdmin)

adminRouter.get('/dashboard',displayItems)
export default adminRouter