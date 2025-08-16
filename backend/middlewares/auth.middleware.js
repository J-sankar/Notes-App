import jwt from 'jsonwebtoken'
import { User } from '../models/userModels.js'
import dotenv from 'dotenv'


dotenv.config()

export const verifyAccessToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("No token provided");
        return res.status(401).json({ message: "No token Provided" })
    }
    try {
        const token = authHeader.split(" ")[1]
        if (!token) {
            console.log("Invalid token");
            return res.status(401).json({ message: "invalid token" })
        }
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET)
        const user = await User.findById(decoded.userID).select('_id name username role status')
        if (user.status === "blocked")
            return res.status(403).json({message:'User Blocked By Admin'})

        req.user = decoded
        console.log("Token verified succesfuly");
        next()

    } catch (err) {
        console.log("ERROR: ", err);
        return res.status(403).json({ message: "Token invalid or expired" })

    }

}

export const verifyRefreshToken = async (req, res, next) => {
    const token = req.cookies.refreshToken

    if (!token) {
        console.log("Refresh token missing:");
        return res.status(401).json({ message: "Refresh token missing" })


    }
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET)
        const user = await User.findById(decoded.userID)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.status === "blocked")
            return res.status(403).json({message:'User Blocked By Admin'})
        if (!user.refreshTokens.includes(token)) {
            return res.status(403).json({ message: "Refresh token not recognized" });
        }
        req.user = user
        next()
    } catch (err) {
        console.log("ERROR: ", err.message);
        return res.status(401).json({ message: "Invalid or expired refreshtoken" })
    }
}


export const verifyAdmin = async (req, res, next) => {
   
    try {
        const user = req.user
        const dbUser = await User.findById(user.userID).select('_id name username role status')
        if (!dbUser) {
            console.log("User not found");
            return res.status(404).json({message:"User not found"})
        }
        if (dbUser.role !== 'admin'){
            console.log("User Unathourized");
            return res.status(403).json({message:"Restricted"})
        }
        
        req.user = dbUser
        console.log("Authorized admin "); 
        
        next()
    } catch (err) {
        console.log("ERROR: ",err.message);
        return res.status(500).json({message:"Server Error. Please Try Again"})
    }
}