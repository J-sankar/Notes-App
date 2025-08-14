import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,

    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    status: {
        type:String,
        default:"active",
        enum:["active","blocked"]
    },
    refreshTokens: {
        type: [String],
        default: []
    },
},
    {
        timestamps: true
    })


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.passwordValidityCheck = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}

export const User = mongoose.model('User', userSchema)