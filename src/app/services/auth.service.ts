import { Injectable } from '@angular/core';
import { AuthApiService } from '../modules/auth/http/requests/auth-api.service';
import { UserLoginAdapter } from '../modules/person/adapters/UserLoginAdapter';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private api:AuthApiService,
  ) { }

  public login(login:UserLoginAdapter){
   return this.api.authUser(login);
  }
}
