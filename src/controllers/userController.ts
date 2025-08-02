import { Request, Response } from 'express';
import { registerUserDto } from '../dto/user/register-dto';
import { LoginDto } from '../dto/user/login-dto';
import * as userService from '../services/userServiece';

export const registerHandler = async (req: Request, res: Response) => {
    try{
        const { username, password, email, number } = req.body;
        const userDto = new registerUserDto(username, password, email, number);
        // const user = await userService.registerUser(userDto);
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const loginHandler = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const loginDto = new LoginDto(email, password);
        const token = await userService.login(loginDto);
        res.json({token})
    } catch (error) {
        if(error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        console.log("error: ", error);
    }
};
