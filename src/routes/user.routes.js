import { Router } from "express";
import {loginUser, logoutUser, registerUser } from "../controllers/users.controllers.js"
import { verifyUser } from "../middlewares/auth.middleware.js";
const userRoutes = Router()

userRoutes.route("/register").post(registerUser)

userRoutes.route("/login").post(loginUser)

userRoutes.route("/logout").post(verifyUser,logoutUser)

export {userRoutes}