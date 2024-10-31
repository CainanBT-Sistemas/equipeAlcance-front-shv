import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ScoresRequestAdapter } from '../../modules/scores/adapters/ScoresRequestAdapter';
import { GlobalService } from '../global.service';
import { ScoresResponseAdapter } from '../../modules/scores/adapters/ScoresResponseAdapter';

@Injectable({
  providedIn: 'root'
})
export class ScoresApiService {

  header = new HttpHeaders();

  constructor(private client: HttpClient) { }

  private baseUrl: string = environment.apiUrl + "/scores";

  public getScoreWithPersonOrNot(adapter: ScoresRequestAdapter){
    this.header = this.getHeader();
    return this.client.post<ScoresResponseAdapter[]>(this.baseUrl.concat("/getScores"),adapter,{ headers: this.header })
  }

  private getHeader(): HttpHeaders {
    if (GlobalService.personLogged()) {
      return new HttpHeaders({ "Content-Type": "application/json", "Authorization": "Bearer ".concat(GlobalService.getPerson().user.token) });
    }
    return new HttpHeaders({ "Content-Type": "application/json" });
  }

}
