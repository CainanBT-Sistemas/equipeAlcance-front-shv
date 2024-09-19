import { Injectable } from '@angular/core';
import { PersonResponseAdapter } from '../modules/person/adapters/PersonResponseAdapter';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private static person: PersonResponseAdapter = new PersonResponseAdapter();
  static icon: string = '../../assets/icons/'

  constructor() { }

  static personLogged(): boolean {
    return this.person.id.trim().length > 0 && this.person.user.token.length > 0
  }

  static personIsADM() {
    return (this.person.user.role.roleCode <= 0)
  }

  static setPerson(p: PersonResponseAdapter) {
    this.person = p
  }

  static getPerson(): PersonResponseAdapter {
    return this.person;
  }
}
