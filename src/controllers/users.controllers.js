import { User } from "../model/users.model.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { cloudinaryUploads } from "../utils/cloudinary.js"

const registerUser = asyncHandler( async (req,res)=>{
    const {fullname , username , email , password} = req.body

    if([fullname,username,email,password].some((field)=> field === "")){
        throw new ApiError(400,"All Field Required")
    }

    const existedUser = await User.findOne({
        $or : [
            {username:username},
            {email : email}
        ]
    })

    if(existedUser){
        throw new ApiError(400,"User already Present")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log("avatar img ", avatarLocalPath);

    let coverImageLocalPath
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath= req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar Image Required")
    }

    const avatar = await cloudinaryUploads(avatarLocalPath)
    const coverImage = await cloudinaryUploads(coverImageLocalPath )

    if(!avatar){
        throw new ApiError(400,"Avatar Image Required")
    }

    const user = await User.create({
        fullname : fullname,
        username : username,
        email : email,
        password : password,
        avatar : avatar.url,
        coverImage : coverImage?.url || ""
    })
    
    const userCreated = await User.findById(user._id).select(" -password -refereshToken ")

    if(!userCreated){
        throw new ApiError(500,"Something went wrong while creating user")
    }

    return res.status(200).send(
        new ApiResponse(200,userCreated,"User created successfully")
    )

})
    
export {registerUser}