import { Injectable } from '@angular/core';
import { StreamsApiService } from './requests/streams-api.service';
import { PersonInsertUpdateAdapter } from '../modules/person/adapters/PersonInsertUpdateAdapter';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class StreamsService {

  constructor(
    private api: StreamsApiService,
  ) { }
  public getAllStreamsByPerson(){
    let person: PersonInsertUpdateAdapter = new PersonInsertUpdateAdapter();
    person.idPublic = GlobalService.getPerson().id
    return this.api.findAllStreamsByPerson(person);
  }
}
