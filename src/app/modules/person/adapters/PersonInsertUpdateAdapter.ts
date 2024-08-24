import { UserInsertUpdateAdapter } from "./UserInsertUpdateAdapter";

export class PersonInsertUpdateAdapter {
    idPublic: string = "";
     name: string = "";
     email: string = "";
     birthday: number = 0;
     user: UserInsertUpdateAdapter = new UserInsertUpdateAdapter();
}