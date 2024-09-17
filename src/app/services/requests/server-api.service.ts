import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GlobalService } from '../global.service';

@Injectable({
  providedIn: 'root'
})
export class ServerApiService {

  header = new HttpHeaders();

  constructor(private client: HttpClient) { }

  private baseUrl: string = environment.apiUrl + "/server";

  public serverIsOnline() {
    this.header = this.getHeaderWithToken()
    return this.client.get<Boolean>(this.baseUrl.concat("/status"), { headers: this.header })
  }

  private getHeaderWithToken(): HttpHeaders {
    if (GlobalService.personLogged()) {
      return new HttpHeaders({ "Content-Type": "application/json", "Authorization": "Bearer ".concat(GlobalService.getPerson().user.token) });
    }
    return new HttpHeaders({ "Content-Type": "application/json" });
  }

}
