import { registerUserDto } from "../dto/user/register-dto";
import { IUser } from "../interfaces/IUser";
import * as userRepository from "../repositories/userRepository";
import * as bcrypt from "bcrypt";

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
