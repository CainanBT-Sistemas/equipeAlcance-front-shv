import { UserResponseAdapter } from "./UserResponseAdapter";

export class PersonResponseAdapter {
    id: string = "";
    name: string = "";
    email: string = "";
    birthday: number = 0;
    user: UserResponseAdapter = new UserResponseAdapter();
}