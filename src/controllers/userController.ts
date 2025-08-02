import { Request, Response } from 'express';
import { registerUserDto } from '../dto/user/register-dto';

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
