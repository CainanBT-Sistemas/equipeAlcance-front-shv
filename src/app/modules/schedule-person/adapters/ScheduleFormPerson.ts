import { PersonResponseAdapter } from "../../person/adapters/PersonResponseAdapter";
import { SchedulePersonResponseAdapter } from "./SchedulePersonResponseAdapter";

export class ScheduleFormPerson {
    person: PersonResponseAdapter = new PersonResponseAdapter();
    schedules: SchedulePersonResponseAdapter[] = new Array<SchedulePersonResponseAdapter>();
}