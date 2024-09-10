import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {

  constructor() { }

  public static dateToUnixTime(date: Date) {
    let unixTime = Math.floor(date.getTime());
    return unixTime;
  }

  public static unixTimeToDate(unixTime: number) {
    return new Date(unixTime);
  }

  public static getToday(): Date {
    console.log(new Date());
    return new Date()
  }

  public static plusDays(date: Date, numberDays: number): Date {
    ;
    date.setHours(0, 0, 0, 0);
    let datePlused: Date = new Date(date.setDate(date.getDate() + numberDays))
    return datePlused
  }

  public static DateToStringFormat(date: Date): string {
    return date.toLocaleDateString()
  }
}
