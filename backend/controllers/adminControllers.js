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