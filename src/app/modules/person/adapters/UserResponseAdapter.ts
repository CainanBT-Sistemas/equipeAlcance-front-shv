import { RoleResponseAdapter } from "./RoleResponseAdapter";

export class UserResponseAdapter {
    id: string = "";
    username: string = "";
    role: RoleResponseAdapter = new RoleResponseAdapter();
    blocked: boolean = true;
    deleted: boolean = true
    token: string = "";
}