import { IUser } from "../../interfaces/IUser";

export class registerUserDto {
  username: string;
  password: string;
  email: string;

  constructor(
    username: string,
    password: string,
    email: string
  ) {
    this.username = username;
    this.password = password;
    this.email = email;
  }

  toEntity(): Partial<IUser> {
    return {
      username: this.username,
      password: this.password,
      email: this.email,
    };
  }
}
