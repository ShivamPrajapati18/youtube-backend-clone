import mongoose from "mongoose";
import {DB_NAME} from "../src/constant.js"
const connectdb = async ()=>{
    try {
        const connect = await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)
        } catch (error) {
        console.error("Mongoose connection error",error);
    }
}

export default connectdb