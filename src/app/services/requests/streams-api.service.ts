import { StreamsInsertUpdateAdapter } from './../../modules/streams/adapters/StreamsInsertUpdateAdapter';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GlobalService } from '../global.service';
import { StreamsResponseAdapter } from '../../modules/streams/adapters/StreamsResponseAdapter';
import { PersonInsertUpdateAdapter } from '../../modules/person/adapters/PersonInsertUpdateAdapter';

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

  private getHeaderWithToken(): HttpHeaders {
    if (GlobalService.personLogged()) {
      return new HttpHeaders({ "Content-Type": "application/json", "Authorization": "Bearer ".concat(GlobalService.getPerson().user.token) });
    }
    return new HttpHeaders({ "Content-Type": "application/json" });
  }
}
