import { Request, Response } from 'express';
import { registerDto } from '../dto/register-dto';
import * as userService from '../services/userService';

export const registerHandler = async (req: Request, res: Response) => {
    try{
        const { username, password, email, number } = req.body;
        const userDto = new registerDto(username, password, email, number);
        const user = await userService.registerUser(userDto);
    }
}
