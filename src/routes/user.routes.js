import { Router } from "express";
import {changePassword, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/users.controllers.js"
import { verifyUser } from "../middlewares/auth.middleware.js";
const userRoutes = Router()

userRoutes.route("/register").post(registerUser)

userRoutes.route("/login").post(loginUser)

userRoutes.route("/logout").post(verifyUser,logoutUser)

userRoutes.route("/change-password").post(verifyUser,changePassword)

userRoutes.route("/refresh-token").post(refreshAccessToken)

export {userRoutes}