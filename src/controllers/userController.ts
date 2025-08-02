import { Request, Response } from 'express';
import { registerUserDto } from '../dto/user/register-user-dto';
import * as userService from '../services/userService';
import { LoginUserDto } from '../dto/user/login-user-dto';

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