import { Injectable } from '@angular/core';
import { PersonInsertUpdateAdapter } from '../modules/person/adapters/PersonInsertUpdateAdapter';
import { AuthService } from './auth.service';
import { UserLoginAdapter } from '../modules/person/adapters/UserLoginAdapter';
import { PersonApiService } from './requests/person-api.service';
import { PersonDeleteAdapter } from '../modules/person/adapters/PersonDeleteAdapter';
import { UserDeleteOrBlockAdapter } from '../modules/person/adapters/UserDeleteOrBlockAdapter';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(
    private api: PersonApiService,
    private authService: AuthService,
  ) { }

  encript(arg0: string): string {
    return btoa(arg0);
  }

  public auth(login: UserLoginAdapter) {
    return this.authService.login(login)
  }

  public insert(person: PersonInsertUpdateAdapter) {
    return this.api.register(person)
  }

  public update(person: PersonInsertUpdateAdapter) {
    return this.api.update(person);
  }

  public updateTypeUser(person: PersonInsertUpdateAdapter) {
    return this.api.updateTypeUser(person);
  }

  public deletePerson(personDelete: PersonDeleteAdapter) {
    return this.api.deletePerson(personDelete);
  }

  public recoverPerson(personDelete: PersonDeleteAdapter) {
    return this.api.recoverPerson(personDelete);
  }

  public blockPerson(userBlock: UserDeleteOrBlockAdapter) {
    return this.api.blockPerson(userBlock);
  }

  public unblockPerson(unblockPerson: UserDeleteOrBlockAdapter) {
    return this.api.unblockPerson(unblockPerson);
  }

  public getAll() {
    return this.api.getAllPersons();
  }
}
