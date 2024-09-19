import { Injectable } from '@angular/core';
import { SchedulePersonApiService } from './requests/schedule-person-api.service';
import { PersonInsertUpdateAdapter } from '../modules/person/adapters/PersonInsertUpdateAdapter';
import { GlobalService } from './global.service';
import { SchedulePersonInsertUpdateAdapter } from '../modules/schedule-person/adapters/SchedulePersonInsertUpdateAdapter';

@Injectable({
  providedIn: 'root'
})
export class SchedulePersonService {

  constructor(
    private api: SchedulePersonApiService,
  ) { }

  public getAllSchedulePersonByPerson(person?: PersonInsertUpdateAdapter) {
    if (person == undefined || person.idPublic == undefined) {
      person = new PersonInsertUpdateAdapter();
      person.idPublic = GlobalService.getPerson().id
    }
    return this.api.getAllSchedulePersonByPerson(person);
  }

  public registerSchedulePerson(schedulesPersonInsertUpdateAdapter: SchedulePersonInsertUpdateAdapter[]) {
    return this.api.registerSchedulePerson(schedulesPersonInsertUpdateAdapter);
  }

}
