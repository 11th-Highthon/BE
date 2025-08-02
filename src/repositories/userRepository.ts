import { IUser } from "../interfaces/IUser";
import User from "../schemas/User";

export const findOneByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};
export const save = async (user: Partial<IUser>): Promise<IUser> => {
  return await User.create(user);
};
