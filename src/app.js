import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended : true
}))
app.use(express.static("public"))
app.use(cookieParser())

import {userRoutes} from "../src/routes/user.routes.js"
import { upload } from "./middlewares/multer.middlewares.js"
app.use("/api/v1/user",
upload.fields([
    {
        name : "avatar",
        maxCount : 1
    },
    {
        name : "coverImage",
        maxCount : 1
    }
]),
userRoutes)

export default app