import { PersonInsertUpdateAdapter } from "../../person/adapters/PersonInsertUpdateAdapter";

export class StreamsInsertUpdateAdapter {
    idPublic: string = "";
    channel: string = "";
    isOnline: boolean = false;
    person: PersonInsertUpdateAdapter = new PersonInsertUpdateAdapter();
}