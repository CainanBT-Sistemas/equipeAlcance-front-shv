import { UserResponseAdapter } from "./UserResponseAdapter";

export class UserInsertUpdateAdapter {
    idPublic: string = "";
    username: string = "";
    password: string = "";
    role: number = 1;

    public static toAdapter(response: UserResponseAdapter): UserInsertUpdateAdapter{
        let user = new UserInsertUpdateAdapter();
        user .idPublic = response.id
        user.role = response.role.roleCode
        user.username = response.username;
        return user;
    }
}