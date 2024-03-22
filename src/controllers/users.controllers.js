import { User } from "../model/users.model.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { cloudinaryUploads } from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"

const cookieOption = {
    httpOnly: true,
    secure: true
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, username, email, password } = req.body

    if ([fullname, username, email, password].some((field) => field === "")) {
        throw new ApiError(400, "All Field Required")
    }

    const existedUser = await User.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    })

    if (existedUser) {
        throw new ApiError(400, "User already Present")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log("avatar img ", avatarLocalPath);

    let coverImageLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar Image Required")
    }

    const avatar = await cloudinaryUploads(avatarLocalPath)
    const coverImage = await cloudinaryUploads(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar Image Required")
    }

    const user = await User.create({
        fullname: fullname,
        username: username,
        email: email,
        password: password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    const userCreated = await User.findById(user._id).select(" -password -refereshToken ")

    if (!userCreated) {
        throw new ApiError(500, "Something went wrong while creating user")
    }

    return res.status(200).send(
        new ApiResponse(200, userCreated, "User created successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    if (!(username || email)) {
        throw new ApiError(400, "Please Provide Credential")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User Not Found")
    }

    const passwordValid = user.isPasswordCorrect(password)

    if (!passwordValid) {
        throw new ApiError(400, "Password is not correct")
    }
    const { refreshToken, accessToken } = await accessAndRefreshTokenGenerator(user._id)

    const loggedIn = await User.findById(user._id).select("-password -refreshToken")

    res.status(200)
        .cookie("accessToken", accessToken, cookieOption)
        .cookie("refreshToken", refreshToken, cookieOption)
        .send(
            new ApiResponse(200, { user: loggedIn, refreshToken, accessToken }, "User Logged In Successfully")
        )

})

async function accessAndRefreshTokenGenerator(userId) {
    try {
        const user = await User.findById(userId)
        const accessToken = user.accessTokenGenerator()
        const refreshToken = user.refreshTokenGenerator()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { refreshToken, accessToken }
    } catch (error) {
        console.log(" Error in accesstoken ", error)
        throw new ApiError(400, "Error in accesstoken ",)
    }
}

const logoutUser = asyncHandler(async (req, res) => {
    const user = req.user

    await User.findByIdAndUpdate(user._id, {
        $set: { refreshToken: undefined }
    })

    res.status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .send(
            { message: "User Logout Successfull" }
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.header.refreshToken

    const decodeRefreshToken = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)

    if(!decodeRefreshToken){
        throw new ApiError(401,"Refresh Token Has been Expired and Used")
    }

    const {accessToken , refreshToken}=await accessAndRefreshTokenGenerator(decodeRefreshToken?._id)

    res.
    status(200)
    .cookie("accessToken",accessToken,cookieOption)
    .cookie("refreshToken",refreshToken,cookieOption)
    .json({
        message : "Token are Refreshed"
    })
    
})

const changePassword = asyncHandler(async (req, res) => {
    try {
        const { oldpassword, newpassword } = req.body
        // const user = req.user
        console.log(oldpassword, newpassword);
        console.log(req.user?._id);
        const user = await User.findById(req.user?._id)
        console.log("user - ", user);
        const isValidPassword = user.isPasswordCorrect(oldpassword)
        console.log(isValidPassword);

        if (!isValidPassword) {
            throw new ApiError(400, "Old Password Is wrong")
        }

        user.password = newpassword
        await user.save({ validateBeforeSave: false })

        res.status(200).send({
            message: "Password Updated Successfully"
        })
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Error while updating the password")
    }
})


export {
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    refreshAccessToken
}