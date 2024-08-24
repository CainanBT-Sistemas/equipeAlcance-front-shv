import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { UserLoginAdapter } from '../../../person/adapters/UserLoginAdapter';
import { PersonResponseAdapter } from '../../../person/adapters/PersonResponseAdapter';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private client: HttpClient) { }

  private baseUrl: string = environment.authURL;

  public authUser(login: UserLoginAdapter){
    return this.client.post<PersonResponseAdapter>(this.baseUrl,login)
  }
}
