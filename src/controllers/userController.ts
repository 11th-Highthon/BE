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