import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PersonInsertUpdateAdapter } from '../../modules/person/adapters/PersonInsertUpdateAdapter';
import { PersonResponseAdapter } from '../../modules/person/adapters/PersonResponseAdapter';
import { GlobalService } from '../global.service';
import { PersonDeleteAdapter } from '../../modules/person/adapters/PersonDeleteAdapter';
import { UserDeleteOrBlockAdapter } from '../../modules/person/adapters/UserDeleteOrBlockAdapter';

@Injectable({
  providedIn: 'root'
})
export class PersonApiService {

  header = new HttpHeaders();

  constructor(private client: HttpClient) { }

  private baseUrl: string = environment.apiUrl + "/person";

  public register(modelInsert: PersonInsertUpdateAdapter) {
    return this.client.post<PersonResponseAdapter>(this.baseUrl, modelInsert)
  }

  public update(modelUpdate: PersonInsertUpdateAdapter) {
    this.header = this.getHeaderWithToken();
    return this.client.put<PersonResponseAdapter>(this.baseUrl, modelUpdate, { headers: this.header });
  }

  public updateTypeUser(modelUpdate: PersonInsertUpdateAdapter) {
    this.header = this.getHeaderWithToken();
    return this.client.put<PersonResponseAdapter>(this.baseUrl.concat("/typeUser"), modelUpdate, { headers: this.header });
  }

  public deletePerson(personDelete: PersonDeleteAdapter) {
    this.header = this.getHeaderWithToken();
    return this.client.put<PersonResponseAdapter>(this.baseUrl.concat("/delete"), personDelete, { headers: this.header })
  }

  public recoverPerson(personDelete: PersonDeleteAdapter) {
    this.header = this.getHeaderWithToken();
    return this.client.put<PersonResponseAdapter>(this.baseUrl.concat("/recover"), personDelete, { headers: this.header })
  }

  public blockPerson(userBlock: UserDeleteOrBlockAdapter) {
    this.header = this.getHeaderWithToken();
    return this.client.put<PersonResponseAdapter>(this.baseUrl.concat("/block"), userBlock, { headers: this.header })
  }

  public unblockPerson(unblockPerson: UserDeleteOrBlockAdapter) {
    this.header = this.getHeaderWithToken();
    return this.client.put<PersonResponseAdapter>(this.baseUrl.concat("/unblock"), unblockPerson, { headers: this.header })
  }

  public getAllPersons() {
    this.header = this.getHeaderWithToken();
    return this.client.get<PersonResponseAdapter[]>(this.baseUrl.concat("/all"), { headers: this.header })
  }

  private getHeaderWithToken(): HttpHeaders {
    if (GlobalService.personLogged()) {
      return new HttpHeaders({ "Content-Type": "application/json", "Authorization": "Bearer ".concat(GlobalService.getPerson().user.token) });
    }
    return new HttpHeaders({ "Content-Type": "application/json" });
  }
}
