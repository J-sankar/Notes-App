import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const createAccessToken = (user) => {
    const payload = {
        userID: user._id,
        role: user.role,
        username: user.username
    }
    return jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: "15min" })
}

export const createRefreshToken = (user) => {
      const payload = {
        userID: user._id,
        role: user.role,
        username: user.username
    }
    return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '7d' })
}