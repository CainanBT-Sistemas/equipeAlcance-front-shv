import { Injectable } from '@angular/core';
import { LiveScheduleApiService } from './requests/live-schedule-api.service';
import { LiveScheduleAdapter } from '../modules/live-schedule/LiveScheduleAdapter';
import { DateUtilsService } from './date-utils.service';

@Injectable({
  providedIn: 'root'
})
export class LiveScheduleService {

  constructor(
    private api: LiveScheduleApiService,
  ) { }

  public registerLiveSchedule(adapters: LiveScheduleAdapter[]) {
    return this.api.registerLiveSchedule(adapters);
  }

  public deleteLiveSchedule(adapters: LiveScheduleAdapter[]) {
    return this.api.deleteLiveSchedule(adapters);
  }

  public getAllPersonsCamDoLive(date: Date) {
    return this.api.getAllPersonsCamDoLive(DateUtilsService.dateToUnixTime(date));
  }

  public getAllLiveSchedule(date: Date) {
    let day = DateUtilsService.dateToUnixTime(date);
    return this.api.getAllLiveSchedule(day)

  }
}
