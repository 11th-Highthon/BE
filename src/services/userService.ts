import { registerUserDto } from "../dto/user/register-user-dto";
import { IUser } from "../interfaces/IUser";
import * as userRepository from "../repositories/userRepository";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { LoginUserDto } from "../dto/user/login-user-dto";

export const findByEmail = async (email: string): Promise<IUser | null> => {
  const existingUser = await userRepository.findOneByEmail(email);
  return existingUser;
};

export const registerUser = async (user: registerUserDto): Promise<IUser> => {
  if (!user.username || !user.email || !user.password) {
    throw new Error("All fields are required");
  }
  const existingUser = await userRepository.findOneByEmail(user.email);
  if (existingUser) {
    throw new Error("User already exists");
  }
  user.password = bcrypt.hashSync(user.password, 10);
  return await userRepository.save(user.toEntity());
};

export const loginUser = async (user: LoginUserDto): Promise<IUser> => {
    const existingUser = await userRepository.findOneByEmail(user.email);
    if (!existingUser) {
        throw new Error("User not found");
    }
    const isPasswordMatching = await bcrypt.compare(user.password, existingUser.password);
    if (!isPasswordMatching) {
        throw new Error("Password is not valid");
    }
    return existingUser;
}


export const login = async (loginDto: LoginUserDto): Promise<string> => {
    const user = await userRepository.findOneByEmail(loginDto.email);
    if(!user) {
        throw new Error("User not found"); 
    }
    const isPasswordValid = bcrypt.compareSync(loginDto.password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    const token = jwt.sign({username: user.username, email: user.email}, process.env.JWT_SECRET_KEY || 'secretKey',{
        expiresIn: "1h"
    });
    return token;
}

export const verifyToken = async (token: string): Promise<IUser> => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY ||  "secretKey") as { username: string; email: string };
    const user = await findByEmail(decoded.email);
    if (!user) {
        throw new Error("User not found");
    } 
    return user;

}