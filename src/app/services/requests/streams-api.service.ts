import { StreamsInsertUpdateAdapter } from './../../modules/streams/adapters/StreamsInsertUpdateAdapter';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GlobalService } from '../global.service';
import { StreamsResponseAdapter } from '../../modules/streams/adapters/StreamsResponseAdapter';
import { PersonInsertUpdateAdapter } from '../../modules/person/adapters/PersonInsertUpdateAdapter';
import { PlataformsAdapter } from '../../modules/streams/adapters/PlataformsAdapter';

@Injectable({
  providedIn: 'root'
})
export class StreamsApiService {
  header = new HttpHeaders();

  constructor(private client: HttpClient) { }

  private baseUrl: string = environment.apiUrl + "/streams";

  public findAllStreamsByPerson(person:PersonInsertUpdateAdapter){
    this.header = this.getHeaderWithToken()
    return this.client.post<StreamsResponseAdapter[]>(this.baseUrl.concat("/allByPerson"), person, { headers: this.header });
  }

  public registerStreams(streams:StreamsInsertUpdateAdapter){
    this.header = this.getHeaderWithToken()
    return this.client.post<StreamsResponseAdapter>(this.baseUrl, streams, { headers: this.header });
  }

  public updateStreams(streams:StreamsInsertUpdateAdapter){
    this.header = this.getHeaderWithToken()
    return this.client.put<StreamsResponseAdapter>(this.baseUrl, streams, { headers: this.header });
  }

  public deleteStreams(streams:StreamsInsertUpdateAdapter){
    this.header = this.getHeaderWithToken()
    return this.client.post<StreamsResponseAdapter>(this.baseUrl.concat("/delete"), streams, { headers: this.header });
  }

  public findAllStreamsPlataforms(){
    this.header = this.getHeaderWithToken()
    return this.client.get<PlataformsAdapter[]>(this.baseUrl.concat("/plataforms/all"), { headers: this.header });
  }

  public findPlataformByName(adapter: PlataformsAdapter){
    this.header = this.getHeaderWithToken()
    return this.client.post<PlataformsAdapter>(this.baseUrl.concat("/plataforms/name"), adapter, { headers: this.header });
  }

  public registerPlataform(adapter: PlataformsAdapter){
    this.header = this.getHeaderWithToken()
    return this.client.post<PlataformsAdapter>(this.baseUrl.concat("/plataforms"), adapter, { headers: this.header });
  }

  public updatePlataform(adapter: PlataformsAdapter){
    this.header = this.getHeaderWithToken()
    return this.client.put<PlataformsAdapter>(this.baseUrl.concat("/plataforms"), adapter, { headers: this.header });
  }

  public enablePlataform(adapter: PlataformsAdapter){
    this.header = this.getHeaderWithToken()
    return this.client.post<PlataformsAdapter>(this.baseUrl.concat("/plataforms/enable"), adapter, { headers: this.header });
  }

  public disablePlataformPlataform(adapter: PlataformsAdapter){
    this.header = this.getHeaderWithToken()
    return this.client.post<PlataformsAdapter>(this.baseUrl.concat("/plataforms/disable"), adapter, { headers: this.header });
  }

  private getHeaderWithToken(): HttpHeaders {
    if (GlobalService.personLogged()) {
      return new HttpHeaders({ "Content-Type": "application/json", "Authorization": "Bearer ".concat(GlobalService.getPerson().user.token) });
    }
    return new HttpHeaders({ "Content-Type": "application/json" });
  }
}
