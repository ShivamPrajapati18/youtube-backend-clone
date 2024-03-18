import { Router } from "express";
import {registerUser} from "../controllers/users.controllers.js"
const userRoutes = Router()

userRoutes.route("/register").post(registerUser)

export {userRoutes}