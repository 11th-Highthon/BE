
import { Request, Response } from 'express';
import { registerUserDto } from '../dto/user/register-user-dto';
import * as userService from '../services/userService';
import { LoginUserDto } from '../dto/user/login-user-dto';

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       500:
 *         description: Internal server error
 */
export const registerHandler = async (req: Request, res: Response) => {
    try{
        const { username, password, email } = req.body;
        const userDto = new registerUserDto(username, password, email);
        const user = await userService.registerUser(userDto);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error: any) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully, returns a token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
export const loginHandler = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const userDto = new LoginUserDto(email, password);

        const token = await userService.login(userDto);
        res.json({token})
    } catch (error: any) {
        console.error("Error during user login:", error);
        res.status(500).json({ message: error.message });
    }
}

// 내 정보 조회 (마이페이지)
export const myPageHandler = async (req: Request, res: Response) => {
    try {
        // 인증 미들웨어에서 userId를 req.user.id로 전달한다고 가정
        const userId = (req as any).user?.id || (req as any).userId || req.body.userId || req.query.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await userService.getMyProfile(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error: any) {
        console.error("Error fetching my page:", error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * @swagger
 * /users/profile/{id}:
 *   get:
 *     summary: Get another user's profile by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export const userProfileHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await userService.getUserProfile(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error: any) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: error.message });
    }
}