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
        const allNotes = await Notes.find().select('title content  owner sharedWith createdAt updatedAt').populate([{ path: 'owner', select: 'name email -_id' }, { path: 'sharedWith.user', select: 'name email  -_id' }]).lean()
        if (allNotes.length === 0) {
            return res.status(200).json({ message: "No Notes Present", notes: [] })
        }
        res.status(200).json(allNotes)
    } catch (err) {
        console.log("ERROR: ", err.message)
        res.status(500).json({ message: "Server Error. Please try again." })
    }
}

export const allUsers = async (req, res) => {
    try {
        const allUsers = await User.find({ _id: { $ne: req.user._id } }).select('name username role status createdAt updatedAt -_id')
        res.status(200).json(allUsers)
    } catch (err) {
        res.status(500).json({ message: "Server Error. Please Try Again Later" })
    }
}


export const updateRole = async (req, res) => {
    const userID = req.params.id
    try {
        if (req.user._id.toString() === userID) {
            console.log('Invalid Operation');
            return res.status(400).json({ message: 'Invalid' })

        }
        const user = await User.findById(userID)
        if (!user) {
            console.log("No user found ");
            return res.status(404).json({ message: 'User not found' })
        }
        if (user.role === "user") {
            user.role = "admin"
        } else if (user.role === "admin") {
            user.role = "user"
        }
        await user.save()
        console.log(`Admin ${req.user._id} attempted to update role for ${userID}`);
        return res.status(200).json({ message: 'Role updated', user: user.name, newrole: user.role })
    } catch (err) {
        return res.status(500).json({ message: 'Server Error. Please try again' })
    }
}

export const deleteUser = async (req, res) => {
    const userID = req.params.id
    try {
        if (userID === req.user._id.toString()) {
            console.log("Cannot delete yourself")
            return res.status(400).json({ message: 'Cannot  delete yourself' })
        }
        const user = await User.findByIdAndDelete(userID)
        if (!user) return res.status(404).json({ message: 'User not Found' })
        console.log("Deleted user")
        return res.status(200).json({ message: 'Deleted user', id: userID })

    } catch (err) {
        console.log("ERROR: ", err.message)

        return res.status(500).json({ message: 'Server Error. Please try again' })
    }
}

export const admin_deleteNote = async (req, res) => {
    const noteID = req.params.noteID
    try {
        const note = await Notes.findByIdAndDelete(noteID)
        if (!note) return res.status(404).json({ message: 'Note not Found' })

        console.log(`Admin ${req.user._id} deleted note ${noteID}`);
        return res.status(200).json({ message: 'Deleted note', id: noteID })

    } catch (err) {
        return res.status(500).json({ message: 'Server Error. Please try again' })
    }
}

export const updateStatus = async (req, res) => {
    const userID = req.params.id
    try {
        if (userID === req.user._id.toString()) {
            console.log("Cannot Change your own status")
            return res.status(400).json({ message: 'Cannot  Block/Unblock yourself' })
        }
        const user = await User.findById(userID)
        if (!user) return res.status(404).json({ message: 'User not Found' })
        if (user.status === "active") user.status = "blocked"
        else user.status = "active"
        await user.save()
        console.log(`Admin ${req.user._id} updated status for user ${userID} to ${user.status}`);
        return res.status(200).json({ message: 'Status Updated', name: user.name, status: user.status })

    } catch (err) {
        return res.status(500).json({ message: 'Server Error. Please try again' })
    }
}