import express from "express";
import { GoogleLogin, GoogleRegister, login, logout, Register } from "../controllers/auth.contollers.js";
import { isAuth } from "../middlewares/isAuth.js";
import { currentUser } from "../controllers/curremtUserController.js";

const userRouter = express.Router();

userRouter.post("/google-register", GoogleRegister);
userRouter.post("/google-login", GoogleLogin);
userRouter.post("/register",Register);
userRouter.post("/login",login);
userRouter.post("/logout",logout)

userRouter.get("/current",isAuth,currentUser)

export default userRouter;
