import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GlobalService } from '../global.service';
import { PersonInsertUpdateAdapter } from '../../modules/person/adapters/PersonInsertUpdateAdapter';
import { SchedulePersonResponseAdapter } from '../../modules/schedule-person/adapters/SchedulePersonResponseAdapter';
import { SchedulePersonInsertUpdateAdapter } from '../../modules/schedule-person/adapters/SchedulePersonInsertUpdateAdapter';

@Injectable({
  providedIn: 'root'
})
export class SchedulePersonApiService {
  header = new HttpHeaders();

  constructor(private client: HttpClient) { }

  private baseUrl: string = environment.apiUrl + "/schedulePerson";

  public getAllSchedulePersonByPerson(person: PersonInsertUpdateAdapter) {
    this.header = this.getHeader()
    return this.client.post<SchedulePersonResponseAdapter[]>(this.baseUrl.concat("/byPerson"), person, { headers: this.header });
  }

  public registerSchedulePerson(schedulesPersonInsertUpdateAdapter: SchedulePersonInsertUpdateAdapter[]) {
    this.header = this.getHeader()
    return this.client.post<SchedulePersonResponseAdapter[]>(this.baseUrl, schedulesPersonInsertUpdateAdapter, { headers: this.header })
  }

  private getHeader(): HttpHeaders {
    if (GlobalService.personLogged()) {
      return new HttpHeaders({ "Content-Type": "application/json", "Authorization": "Bearer ".concat(GlobalService.getPerson().user.token) });
    }
    return new HttpHeaders({ "Content-Type": "application/json" });
  }
}
