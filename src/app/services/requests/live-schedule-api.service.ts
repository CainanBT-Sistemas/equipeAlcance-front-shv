import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LiveScheduleAdapter } from '../../modules/live-schedule/LiveScheduleAdapter';
import { GlobalService } from '../global.service';
import { PersonResponseAdapter } from '../../modules/person/adapters/PersonResponseAdapter';

@Injectable({
  providedIn: 'root'
})
export class LiveScheduleApiService {
  header = new HttpHeaders();

  constructor(private client: HttpClient) { }

  private baseUrl: string = environment.apiUrl + "/liveSchedule";

  public registerLiveSchedule(adapters: LiveScheduleAdapter[]) {
    this.header = this.getHeader();
    return this.client.post<LiveScheduleAdapter[]>(this.baseUrl, adapters, { headers: this.header })
  }

  public deleteLiveSchedule(adapters: LiveScheduleAdapter[]) {
    this.header = this.getHeader();
    return this.client.put<LiveScheduleAdapter[]>(this.baseUrl.concat("/delete"), adapters, { headers: this.header })
  }

  public getAllPersonsCamDoLive(date: number) {
    this.header = this.getHeader()
    return this.client.get<PersonResponseAdapter[]>(this.baseUrl.concat("/PersonsCamDoLive/".concat(date.toString())), { headers: this.header })
  }

  public getAllLiveSchedule(day: Number) {
    this.header = this.getHeader()
    return this.client.get<LiveScheduleAdapter[]>(this.baseUrl.concat("/AllLiveSchedule/").concat(day.toString()), { headers: this.header })
  }

  private getHeader(): HttpHeaders {
    if (GlobalService.personLogged()) {
      return new HttpHeaders({ "Content-Type": "application/json", "Authorization": "Bearer ".concat(GlobalService.getPerson().user.token) });
    }
    return new HttpHeaders({ "Content-Type": "application/json" });
  }
}
