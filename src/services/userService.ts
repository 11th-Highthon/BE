import { registerUserDto } from "../dto/user/register-user-dto";
import { IUser } from "../interfaces/IUser";
import * as userRepository from "../repositories/userRepository";
import * as bcrypt from "bcrypt";
import { loginUserDto } from "../dto/user/login-user-dto";

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

export const loginUser = async (user: loginUserDto): Promise<IUser> => {
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