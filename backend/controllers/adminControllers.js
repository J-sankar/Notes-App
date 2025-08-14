import express from 'express'
import mongoose from "mongoose";
import { User } from "../models/userModels.js";
import { Notes } from "../models/notesModels.js";


export const displayItems = async (req, res) => {
    try {
        const [userCount, noteCount] = await Promise.all([
            User.countDocuments(),
            Notes.countDocuments()
        ]);

        return res.status(200).json({ message: "Authorized", userCount, noteCount })

    } catch (err) {
        console.log("ERROR: ", err.message);
        return res.status(500).json({ message: "Server Error. Please Try Again." })

    }
}

export const allNotes = async (req, res) => {
    try {
        const allNotes = await Notes.find().select('title content  owner sharedWith createdAt updatedAt').populate([{path:'owner',select:'name email -_id'},{path:'sharedWith.user', select:'name email  -_id'}]).lean()
        res.status(200).json(allNotes)
    } catch (err) {
        console.log("ERROR: ", err.message)
        res.status(500).json({ message: "Server Error. Please try again." })
    }
}

export const allUsers = async (req,res) =>{
    try {
        const allUsers = await User.find().select('name username role status createdAt updatedAt -_id')
        res.status(200).json(allUsers)
    }catch(err){
        res.status(500).json({message:"Server Error. Please Try Again Later"})
    }
}