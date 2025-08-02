import { IUser } from "../interfaces/IUser";
import User from "../schemas/User";
import mongoose from "mongoose";

export const findOneByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};
export const save = async (user: IUser): Promise<IUser> => {
  return await User.create(user);
};
