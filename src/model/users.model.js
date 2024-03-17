import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true ,
        trim : true,
        index : true,
        lowercase : true
    },
    email : {
        type : String,
        required : true,
        unique : true ,
        trim : true,
        lowercase : true
    },
    fullname : {
        type :String,
        required : true,
        trim : true,
    },
    avatar : {
        type : String,
        required : true
    },
    coverImage : {
        type : String
    },
    watchHistory : [
        {
            type : mongoose.Types.ObjectId,
            ref : "Video"
        }
    ],
    password : {
        type : String,
        required : true
    },
    refereshToken : {
        type :String
    }
},{timestamps : true})

userSchema.pre("save",function (next){
    if(!this.isModified("password")) return next()
    this.password = bcrypt.hashSync(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = function (password){
    return bcrypt.compareSync(password,this.password)
}

userSchema.methods.accessTokenGenerator = function (){
    return jwt.sign({
        _id : this._id,
        username : this.username,
        fullname : this.fullname
    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_DURATION
    })
}

userSchema.methods.refreshTokenGenerator = function (){
    return jwt.sign({
        _id : this._id
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn : process.env.REFRESH_TOKEN_DURATION
    })
}

export const user = mongoose.model("User",userSchema)