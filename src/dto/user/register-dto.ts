import { IUser } from "../../interfaces/IUser";

export class registerUserDto{
    username: string;
    password: string;
    email: string;
    number: string;

    constructor(username: string, password: string, email: string, number: string) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.number = number;
    }

    toEntity() : Partial<IUser> {
        return {
            username: this.username,
            password: this.password,
            email: this.email
        };
    }
}
