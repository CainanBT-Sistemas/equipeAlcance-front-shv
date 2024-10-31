import { Injectable } from '@angular/core';
import { ScoresApiService } from './requests/scores-api.service';
import { ScoresRequestAdapter } from '../modules/scores/adapters/ScoresRequestAdapter';

@Injectable({
  providedIn: 'root'
})
export class ScoresService {

  constructor(
    private api: ScoresApiService
  ) { }

  public getScoreWithPersonOrNot(adapter: ScoresRequestAdapter){
    return this.api.getScoreWithPersonOrNot(adapter);
  }
}
