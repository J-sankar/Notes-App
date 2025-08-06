import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sharedWith: [

        {

            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"

            },
            canEdit: {type:Boolean,default:false}
        }


    ],

    isPublic: {
        type: Boolean,
        default: false,
    }
},
    {
        timestamps: true
    })

export const Notes = mongoose.model('Notes', notesSchema)