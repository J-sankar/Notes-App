import { User } from '../models/userModels.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()
const createAccessToken = (user) => {
    const payload = {
        userID: user._id,
        role: user.role,
        username: user.name
    }
    return jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: "15min" })
}

const createRefreshToken = (user) => {
    return jwt.sign({ userID: user._id,role:user.role,username:user.name }, process.env.REFRESH_SECRET, { expiresIn: '7d' })
}

export const registerNewUser = async (req, res) => {
    try {
        const { name, email, phone, password, username, role } = req.body
        if (!name || !email || !password || !username || !role) {
            console.log("Data not found");
            return res.status(400).json({ Message: "Please provide all data" })

        }
        const emailExists = await User.findOne({ email })
        if (emailExists) {
            console.log("Email already Exists");
            return res.status(409).json({ Mesaage: "Email already exists" })
        }
        const usernameExists = await User.findOne({ username })
        if (usernameExists) {

            console.log("Username already exists");
            return res.status(409).json({ Message: "username alread exists" })
        }
        await User.create({ name, email, phone, password, username, role })
        console.log("New user registered");

        return res.status(200).json({ Message: "New user registered" })


    } catch (err) {
        console.log("ERROR: ", err);

        return res.status(500).json({ Message: "Server Error: please try again" })
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(req.body);

        if (!email || !password) {
            console.log("Data not found");
            return res.status(400).json({ Message: "Please provide all data" })

        }
        const isUser = await User.findOne({ email })
        if (!isUser) {
            console.log("Email not registered");
            return res.status(401).json({ Message: "Email not registered" })

        }
        const isMatch = await isUser.passwordValidityCheck(password)
        console.log(isMatch);
        console.log(isUser.password);

        if (isUser && !isMatch) {
            console.log("Password is incorrect");
            return res.status(401).json({ Message: "Password is incorrect" })

        }



        const accessToken = createAccessToken(isUser)
        const refreshToken = createRefreshToken(isUser)
        isUser.refreshTokens.push(refreshToken)
        await isUser.save()
        res.cookie('refreshToken', refreshToken, {

            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
        )
        console.log("Login successfull");

        return res.status(200).json({ accessToken, Message: "Login Successull" })


    } catch (err) {
        console.log("ERROR: ", err);

        return res.status(500).json({ Message: "Server Error: please try again" })

    }

}


export const refresh = async (req, res) => {
    try {
        const user = req.user
        const newAccessToken = createAccessToken(user)
             console.log("newaccess token created for user:", user.userID);
             return res.status(200).json({ accessToken: newAccessToken })
        
    } catch (err) {
        console.log("ERROR during token refresh: ",err.message);
        return res.status(500).json({message:"Internal server error"})
        
    }
}