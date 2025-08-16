import jwt from 'jsonwebtoken'
import { createAccessToken, createRefreshToken } from '../utils/tokens.js'





const mockUser = {
    _id: 'dgrty12663627be',
    role: 'user',
    username: 'tester1'
}
describe("createAccesstoken", () => {

    test("should return true if accesstoken is generated", () => {

        const token = createAccessToken(mockUser)
        expect(typeof token).toBe("string")

        const verifier = jwt.verify(token, process.env.ACCESS_SECRET)

        expect(verifier.userID).toBe(mockUser._id)
        expect(verifier.role).toBe(mockUser.role)
        expect(verifier.username).toBe(mockUser.username)
    }),
        test("should return the time for expiring", () => {


            const token = createAccessToken(mockUser)

            const decoded = jwt.verify(token, process.env.ACCESS_SECRET)

            const expiresIn = decoded.exp - decoded.iat

            expect(expiresIn).toBe(15 * 60)
        })

})

describe("Create refresh token", () => {
    test("should create refresh token", ()=>{
        
        const token = createRefreshToken(mockUser)
        expect(typeof token).toBe('string')
        
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET)
        
        expect(decoded.userID).toBe(mockUser._id)
        expect(decoded.role).toBe(mockUser.role)
        expect(decoded.username).toBe(mockUser.username)
    }),
    test("should expire in 7 days",()=>{
        const token = createRefreshToken(mockUser)
        const decoded = jwt.verify(token , process.env.REFRESH_SECRET)

        const expiresIn = decoded.exp - decoded.iat

        expect(expiresIn).toBe(7*24*60*60)
    })
})