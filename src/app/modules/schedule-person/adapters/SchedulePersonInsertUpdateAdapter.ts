import { PersonResponseAdapter } from "../../person/adapters/PersonResponseAdapter";

export class SchedulePersonInsertUpdateAdapter {
    idPublic: string = "";
    weekDay: string = "";
    hour: string = "";
    person: PersonResponseAdapter = new PersonResponseAdapter();
}