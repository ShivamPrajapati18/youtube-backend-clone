import { Router } from "express";
import {loginUser, registerUser} from "../controllers/users.controllers.js"
const userRoutes = Router()

userRoutes.route("/register").post(registerUser)

userRoutes.route("/login").post(loginUser)

export {userRoutes}