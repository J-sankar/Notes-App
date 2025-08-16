import { User } from '../models/userModels.js'
import { Notes } from '../models/notesModels.js'
import mongoose from 'mongoose'

export const createNote = async (req, res,next) => {
    const { title, content } = req.body
    if (!title) {
        const error = new Error("Title is required")
        error.status = 400
        return next(error)
    }

    const userID = req.user.userID
    const user = await User.findOne({ _id: userID })
    if (!user) {
        const error = new Error("User not found");
        error.status = 404
        return next(error)
    }

    try {
        const notes = {
            title: title,
            content: content,
            owner: userID
        }
        const createnote = new Notes(notes)
        await createnote.save()
        return res.status(201).json({ message: "New note created" })

    } catch (err) {
       next(err)
    }
}

export const getAllNotesOfUser = async (req, res, next) => {
    try {
        let query = { owner: req.user.userID }
        const user = await User.findById(req.user.userID)
        if (!user) {
            const error = new Error("No user found")
            error.status = 404
            return next(error)
        }
        const { search, tags, sort = 'desc', page = 1, limit = 10 } = req.query
        if (search) query.title = { $regex: search, $options: 'i' }
        if (tags) {

            const tagList = tags.split(',').map(tag => new RegExp(tag.trim(), 'i'))
            query.tags = { $in: tagList }
        }

        const notes = await Notes.find(query).select('_id title content sharedwith createdAt updatedAt').sort({ 'createdAt': sort === 'asc' ? 1 : -1 }).skip((page - 1) * limit).limit(Number(limit)).populate('sharedWith.user', 'name email -_id')
        if (notes.length === 0) return res.status(200).json({ success: true, data: [] })
        return res.status(200).json({ success: true, data: notes })
    } catch (err) {
        next(err)

    }
}

export const editNote = async (req, res,next) => {
    const userID = req.user.userID
    const noteID = req.params.noteID
    console.log(req.body);
    const { title, content } = req.body

    const note = await Notes.findById(noteID)
    try {
        if (!note) {
            const error = new Error("Note not found")
            error.status = 404
            return next(error)
        }
        if (!title) {
             const error = new Error("Provide title or content to update")
            error.status = 400
            return next(error)
        }

        if (note.owner.toString() !== userID) {
             const error = new Error("Not authorized")
            error.status = 403
            return next(error)
        }
        note.title = title || note.title
        note.content = content || note.content
        await note.save()
        return res.status(200).json({ message: "Note updated successfully" })
    } catch (err) {
        next(err)

    }
}


export const deleteNote = async (req, res,next) => {
    const userID = req.user.userID
    const noteID = req.params.noteID
    const note = await Notes.findById(noteID)
    try {
        if (!note) {
             const error = new Error("Note not found")
            error.status = 404
            return next(error)
        }
        if (note.owner.toString() !== userID) {
           const error = new Error("Not authorized")
            error.status = 403
            return next(error)
        }
        await Notes.findByIdAndDelete(noteID)
        return res.status(200).json({ message: "Note deleted successfully" })
    } catch (err) {
         next(err)
    }

}
export const shareNote = async (req, res,next) => {
    const userID = req.user.userID
    if (!userID) {
        const error = new Error("User not found")
            error.status = 404
            return next(error)
    }
    const { shareID, canEdit } = req.body
    if (!shareID) {
        const error = new Error("Missing recipient id")
            error.status = 400
            return next(error)
        }
    const shareUser = await User.findById(shareID)
    if (!shareUser) {
        const error = new Error("Recipient not found")
            error.status = 404
            return next(error)
    }
    try {
        const note = await Notes.findById(req.params.noteID)
        if (!note) {
            const error = new Error("Note not found")
            error.status = 404
            return next(error)
        }

        if (userID !== note.owner.toString())
        {
            const error = new Error("Mismatched vaalidation of recipient id")
            error.status = 403
            return next(error)
        }

        note.sharedWith.push({ user: shareID, canEdit })
        await note.save()
        return res.status(200).json({ message: "shared with the user" })
    } catch (err) {
        next(err)
    }

}
export const sharedWithMe = async (req, res,next) => {
    const userID = req.user.userID;
    if (!userID) {
       const error = new Error("User not found")
            error.status = 404
            return next(error)
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
        next(err)
    }
}

