import { Router } from "express";
import { registerHandler, loginHandler } from "../controllers/userController";
import { followUser, unfollowUser } from "../controllers/followController";

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and authentication
 */

const userRouter = Router();
userRouter.post('/register', registerHandler);
userRouter.post('/login', loginHandler);
userRouter.post('/follow', followUser);
userRouter.post('/unfollow', unfollowUser);

export default userRouter;