import { PersonResponseAdapter } from "../../person/adapters/PersonResponseAdapter";

export class SchedulePersonResponseAdapter {
    idPublic: string = "";
    weekDay: string = ""
    hour: string = "";
    person: PersonResponseAdapter = new PersonResponseAdapter();
}