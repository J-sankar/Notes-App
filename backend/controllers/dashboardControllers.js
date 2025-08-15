import { User } from '../models/userModels.js'
import { Notes } from '../models/notesModels.js'
import mongoose from 'mongoose'

export const createNote = async (req, res) => {
    const { title, content } = req.body
    if (!title) {
        return res.status(400).json({ message: "Title is required" })
    }
    
    const userID = req.user.userID
    const user = await User.findOne({ _id: userID })
    if (!user) {
        console.log("User not found");
        return res.status(404).json({ message: "user not found" })

    }

    try {
        const notes = {
            title: title,
            content: content,
            owner: userID,
            sharedWith: req.body.sharedWith
        }
        const createnote = new Notes(notes)
        await createnote.save()
        console.log(await Notes.find().populate('owner', 'name username'));
        return res.status(201).json({ message: "New note created" })

    } catch (err) {
        console.log("ERROR : ", err.message);
        return res.status(500).json({ message: "server error, please try again" })
    }
}

export const getAllNotesOfUser = async (req, res) => {
    const userID = req.user.userID
    const user = await User.findById(userID)
    if (!user) {
        console.log("User note found");
        return res.status(404).json({ message: "User not found" })
    }
    try {
        const notes = await Notes.find({ owner: userID }).populate('owner', 'name email').lean()
        if (notes.length == 0) {
            console.log("no notes available. create a note to access");
            return res.status(200).json({ message: "No notes available from this user" })

        }
        console.log("Notes obtained sent as reponse");

        return res.status(200).json(notes)
    } catch (err) {
        console.log("ERROR: ", err.message);

        return res.status(500).json({ message: "internal server error. please try" })
    }

}

export const editNote = async (req, res) => {
    const userID = req.user.userID
    const noteID = req.params.noteID
    console.log(req.body);
    const { title, content } = req.body

    const note = await Notes.findById(noteID)
    try {
        if (!note) {
            console.log("No note found");
            return res.status(404).json({ message: "Note not found" })
        }
        if (!title) {
            return res.status(400).json({ message: "Provide title or content to update" })
        }
        
        if (note.owner.toString() !== userID) {
            console.log("Not authorized");
            return res.status(403).json({ messages: "Not authorized" })
        }
        note.title = title || note.title
        note.content = content || note.content
        await note.save()
        return res.status(200).json({ message: "Note updated successfully" })
    } catch (err) {
        console.log("ERROR: ", err.message);
        res.status(500).json({ message: "server error . please try again" })

    }
}


export const deleteNote = async (req, res) => {
    const userID = req.user.userID
    const noteID = req.params.noteID
    const note = await Notes.findById(noteID)
    try {
        if (!note) {
            console.log("No note found");
            return res.status(404).json({ message: "Note not found" })
        }
        if (note.owner.toString() !== userID) {
            console.log("Not authorized");
            return res.status(403).json({ messages: "Not authorized" })
        }
        await Notes.findByIdAndDelete(noteID)
        return res.status(200).json({ message: "Note deleted successfully" })
    } catch (err) {
        console.log("ERROR: ", err.message);
        res.status(500).json({ message: "server error . please try again" })
    }

}
export const shareNote = async (req, res) => {
    const userID = req.user.userID
    if (!userID) {
        console.log("User not found")
        return res.status(404).json({ message: "User not found" })
    }
        const { shareID, canEdit } = req.body
        if (!shareID) {
            console.log("Recipient ID missing")
            return res.status(400).json({ message: "Recipient ID is required" })
        }
        const shareUser = await User.findById(shareID)
        if (!shareUser) return res.status(404).json({ message: "recipient no found" })
    try {
        const note = await Notes.findById(req.params.noteID)
        if (!note) return res.status(404).json({ message: "Note not found" }) 

        if (userID !== note.owner.toString())
            return res.status(403).json({message:"mismatch"})
        
        note.sharedWith.push({ user: shareID, canEdit })
        await note.save()
        return res.status(200).json({ message: "shared with the user" })
    } catch (err) {
        console.log("ERROR: ", err.message)
        return res.status(500).json({ message: "Server Error, Please try again" })
    }

}
export const sharedWithMe = async (req, res) => {
    const userID = req.user.userID;
    if (!userID) {
        console.log("User not found");
        return res.status(404).json({ message: "User not found" })
    }
    try {
        const notes = await Notes.find(
            { "sharedWith.user": userID },
            { title: 1, content: 1, owner: 1, _id: 0 }
        ).populate('owner', 'name email -_id')

        if (notes.length === 0) {
            console.log("No notes shared with you");
            return res.status(204).json({ message: "No notes found" })
        }

        console.log("Notes obtained");
        return res.status(200).json(notes)

    } catch (err) {
        console.log("ERROR : ", err.message);
        return res.status(500).json({ message: "Server error. please try again later" })
    }
}