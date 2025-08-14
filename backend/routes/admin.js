import express from "express";
import { verifyAdmin,verifyAccessToken } from "../middlewares/auth.middleware.js";
import { displayItems, allNotes,allUsers } from "../controllers/adminControllers.js";

 const adminRouter = express.Router()
adminRouter.use(verifyAccessToken,verifyAdmin)

adminRouter.get('/dashboard',displayItems)
 
adminRouter.get('/notes',allNotes)
adminRouter.get('/users',allUsers)

// /seeallnotes /seaallusers /updateuserstatus /





export default adminRouter



