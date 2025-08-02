import { LoginDto } from "../dto/user/login-dto";
import { registerUserDto } from "../dto/user/register-dto";
import { IUser } from "../interfaces/IUser";
import * as userRepository from "../repositories/userRepository";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export const findByEmail = async (email: string): Promise<IUser> => {
  const existingUser = await userRepository.findOneByEmail(email);
  if (!existingUser) {
    throw new Error("User not found");
  }
  return existingUser;
};

export const save = async (user: registerUserDto): Promise<IUser> => {
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

export const login = async (loginDto: LoginDto): Promise<string> => {
    const user = await userRepository.findOneByEmail(loginDto.email);
    if(!user) {
        throw new Error("User not found"); 
    }
    const isPasswordValid = bcrypt.compareSync(loginDto.password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    const token = jwt.sign({username: user.username, email: user.email}, "secretKey",{
        expiresIn: "1h"
    });
    return token;
}

export const verifyToken = async (token: string): Promise<IUser> => {
    const decoded = jwt.verify(token, "secretKey") as { username: string; email: string };
    const user = await findByEmail(decoded.email);
    if (!user) {
        throw new Error("User not found");
    } 
    return user;

}