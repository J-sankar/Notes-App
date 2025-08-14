import express from 'express'
import { verifyAccessToken } from '../middlewares/auth.middleware.js'
import { createNote,getAllNotesOfUser,editNote,deleteNote,sharedWithMe,shareNote } from '../controllers/dashboardControllers.js'

import mongoose from 'mongoose'


const dashboardRouter = express.Router()
dashboardRouter.use(verifyAccessToken)

dashboardRouter.post('/my-notes/create', createNote)
dashboardRouter.get('/my-notes', getAllNotesOfUser)
dashboardRouter.put('/my-notes/:noteID',editNote)
dashboardRouter.delete('/my-notes/:noteID',deleteNote)
dashboardRouter.get('/my-notes/shared-with-me',sharedWithMe)
dashboardRouter.patch('/my-notes/:noteID/share',shareNote)
export default dashboardRouter