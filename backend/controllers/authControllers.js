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
    return jwt.sign({ userID: user._id, role: user.role, username: user.name }, process.env.REFRESH_SECRET, { expiresIn: '7d' })
}

export const registerNewUser = async (req, res) => {
    try {
        const { name, email, phone, password, username } = req.body
        if (!name || !email || !password || !username) {
            console.log("Data not found");
            return res.status(400).json({ message: "Please provide all data" })

        }
        const emailExists = await User.findOne({ email })
        if (emailExists) {
            console.log("Email already Exists");
            return res.status(409).json({ Mesaage: "Email already exists" })
        }
        const usernameExists = await User.findOne({ username })
        if (usernameExists) {

            console.log("Username already exists");
            return res.status(409).json({ message: "username alread exists" })
        }
        await User.create({ name, email, phone, password, username })
        console.log("New user registered");

        return res.status(201).json({ message: "New user registered" ,data:{name,username}})


    } catch (err) {
        console.log("ERROR: ", err);

        return res.status(500).json({ message: "Server Error: please try again" })
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(req.body);

        if (!email || !password) {
            console.log("Data not found");
            return res.status(400).json({ message: "Please provide all data" })

        }
        const isUser = await User.findOne({ email })
        if (!isUser) {
            console.log("Email not registered");
            return res.status(404).json({ message: "Email not registered" })

        }
        const isMatch = await isUser.passwordValidityCheck(password)
        console.log(isMatch);
        console.log(isUser.password);
        
        if (isUser && !isMatch) {
            console.log("Password is incorrect");
            return res.status(404).json({ message: "Password is incorrect" })
            
        }
        
        if (isUser.status === "blocked")
            return res.status(403).json({message:'Blocked by admin'})

        if (isUser.refreshTokens.length >= 3) {

            isUser.refreshTokens.shift()

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

        return res.status(200).json({ accessToken, message: "Login Successull" })


    } catch (err) {
        console.log("ERROR: ", err);

        return res.status(500).json({ message: "Server Error: please try again" })

    }

}

export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(400).json("No refresh token to clear")
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
        const user = await User.findById(decoded.userID)
        if (!user) return res.status(404).json("Not found")
        user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken)
        await user.save()
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })
        res.status(200).json({ message: "logout successfull" })
    } catch (err) {
        console.log("ERROR:", err.message);
        return res.send(500).json({message:"Server Error. Please try again."})

    }
}

export const refresh = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: No user found" })
        }
        const newAccessToken = createAccessToken(user)
        console.log("newaccess token created for user:", user._id);
        return res.status(200).json({message:"Success", accessToken: newAccessToken })

    } catch (err) {
        console.log("ERROR during token refresh: ", err.message);
        return res.status(500).json({ message: "Internal server error" })

    }
}