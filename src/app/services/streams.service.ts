import { Injectable } from '@angular/core';
import { StreamsApiService } from './requests/streams-api.service';
import { PersonInsertUpdateAdapter } from '../modules/person/adapters/PersonInsertUpdateAdapter';
import { GlobalService } from './global.service';
import { StreamsInsertUpdateAdapter } from '../modules/streams/adapters/StreamsInsertUpdateAdapter';
import { PlataformsAdapter } from '../modules/streams/adapters/PlataformsAdapter';

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

  public registerStreams(streams:StreamsInsertUpdateAdapter){
    return this.api.registerStreams(streams);
  }

  public updateStreams(streams:StreamsInsertUpdateAdapter){
    return this.api.updateStreams(streams);
  }

  public deleteStreams(streams:StreamsInsertUpdateAdapter){
    return this.api.deleteStreams(streams);
  }

  public findAllStreamsPlataforms(){
    return this.api.findAllStreamsPlataforms();
  }

  public findPlataformByName(adapter: PlataformsAdapter){
    return this.api.findPlataformByName(adapter);
  }

  public registerPlataform(adapter: PlataformsAdapter){
    return this.api.registerPlataform(adapter);
  }

  public updatePlataform(adapter: PlataformsAdapter){
    return this.api.updatePlataform(adapter);
  }

  public enablePlataform(adapter: PlataformsAdapter){
    return this.api.enablePlataform(adapter);
  }

  public disablePlataformPlataform(adapter: PlataformsAdapter){
    return this.api.disablePlataformPlataform(adapter);
  }
}
