import { Injectable } from '@angular/core';
import { ServerApiService } from './requests/server-api.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private api: ServerApiService) { }

  public serverIsOnline() {
    return this.api.serverIsOnline();
  }
}
