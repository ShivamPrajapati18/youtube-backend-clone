import jwt from "jsonwebtoken"
import { User } from "../model/users.model.js"
import ApiError from "../utils/apiError.js"

const verifyUser = async (req,_,next)=>{
    try {
        const token = req.cookies?.accessToken || req?.header("Authorization").replace("Bearer ","")
        const decode = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decode._id)
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401,"Unauthorized User")
    }
}

export {
    verifyUser
}