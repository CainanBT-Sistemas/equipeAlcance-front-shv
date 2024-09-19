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
    return new Date()
  }

  public static plusDays(date: Date, numberDays: number): Date {
    date = this.setHours(date, 0)
    let datePlused: Date = new Date(date.setDate(date.getDate() + numberDays))
    return datePlused
  }

  public static setHours(date: Date, hour: number): Date {
    return new Date(date.setHours(hour, 0, 0, 0));
  }

  public static DateToStringFormatDate(date: Date): string {
    return date.toLocaleDateString()
  }
  public static DateToStringFormatTime(date: Date): string {
    return date.toLocaleTimeString()
  }
}
