import { PersonInsertUpdateAdapter } from "../../person/adapters/PersonInsertUpdateAdapter";
import { PlataformsAdapter } from "./PlataformsAdapter";

export class StreamsInsertUpdateAdapter {
    idPublic: string = "";
    channel: string = "";
    isOnline: boolean = false;
    person: PersonInsertUpdateAdapter = new PersonInsertUpdateAdapter();
    plataform: PlataformsAdapter = new PlataformsAdapter();
}