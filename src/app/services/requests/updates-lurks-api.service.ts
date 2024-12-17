import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GlobalService } from '../global.service';
import { UpdatesLurksAdapter } from '../../modules/UpdatesLurks/adapters/UpdatesLurksAdapter';

@Injectable({
  providedIn: 'root'
})
export class UpdatesLurksApiService {

  header = new HttpHeaders();

  constructor(private client: HttpClient) { }

  private baseUrl: string = environment.apiUrl + "/systems";

  public getAllUpdatesLurks(){
    this.header =this.getHeaderWithToken()
    return this.client.get<UpdatesLurksAdapter[]>(this.baseUrl,{headers:this.header});
  }

  private getHeaderWithToken(): HttpHeaders {
    if (GlobalService.personLogged()) {
      return new HttpHeaders({ "Content-Type": "application/json", "Authorization": "Bearer ".concat(GlobalService.getPerson().user.token) });
    }
    return new HttpHeaders({ "Content-Type": "application/json" });
  }
}
