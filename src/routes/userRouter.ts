import { Router } from "express";
import { registerHandler, loginHandler } from "../controllers/userController";
import { myPageHandler, userProfileHandler } from "../controllers/userController";
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
userRouter.get('/me', myPageHandler);
userRouter.get('/profile/:id', userProfileHandler);
userRouter.post('/follow', followUser);
userRouter.post('/unfollow', unfollowUser);

export default userRouter;