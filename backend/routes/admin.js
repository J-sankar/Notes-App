import express from "express";
import { verifyAdmin,verifyAccessToken } from "../middlewares/auth.middleware.js";
import { displayItems, allNotes,allUsers, updateRole, deleteUser, updateStatus, admin_deleteNote } from "../controllers/adminControllers.js";

 const adminRouter = express.Router()
adminRouter.use(verifyAccessToken,verifyAdmin)

adminRouter.get('/dashboard',displayItems)
 
adminRouter.get('/notes',allNotes)
adminRouter.delete('/notes/:noteID/delete',admin_deleteNote)


adminRouter.get('/users',allUsers)
adminRouter.put('/users/:id/role',updateRole)
adminRouter.put('/users/:id/status',updateStatus)
adminRouter.delete('/users/:id/delete',deleteUser)

// /seeallnotes /seaallusers /updateuserstatus /





export default adminRouter



