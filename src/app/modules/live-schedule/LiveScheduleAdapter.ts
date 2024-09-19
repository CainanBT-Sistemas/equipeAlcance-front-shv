import { PersonResponseAdapter } from "../person/adapters/PersonResponseAdapter"

export class LiveScheduleAdapter {
    idPublic: string = ""
    date: number = 0
    startTime: number = 0
    endTime: number = 0
    person: PersonResponseAdapter = new PersonResponseAdapter()
}