import { PersonResponseAdapter } from './PersonResponseAdapter';
import { UserInsertUpdateAdapter } from "./UserInsertUpdateAdapter";
import { UserResponseAdapter } from './UserResponseAdapter';

export class PersonInsertUpdateAdapter {
    idPublic: string = "";
     name: string = "";
     email: string = "";
     birthday: number = 0;
     user: UserInsertUpdateAdapter = new UserInsertUpdateAdapter();

     public static toAdapter(response: PersonResponseAdapter): PersonInsertUpdateAdapter{
        let person = new PersonInsertUpdateAdapter();
        person.birthday = response.birthday
        person.email = response.email
        person.idPublic = response.id
        person.name = response.name
        person.user = UserInsertUpdateAdapter.toAdapter(response.user);
        return person;
     }
}