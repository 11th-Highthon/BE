import { Router } from "express";
import { registerHandler, loginHandler } from "../controllers/userController";

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and authentication
 */

const userRouter = Router();
userRouter.post('/register', registerHandler);
userRouter.post('/login', loginHandler);

export default userRouter;