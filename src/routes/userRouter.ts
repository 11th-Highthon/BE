import { Router } from "express";
import { registerHandler, loginHandler } from "../controllers/userController";


const userRouter = Router();
userRouter.post('/register', registerHandler);
userRouter.post('/login', loginHandler);
