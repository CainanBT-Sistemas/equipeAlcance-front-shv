import { PersonResponseAdapter } from "../../person/adapters/PersonResponseAdapter";
import { StreamsResponseAdapter } from "../../streams/adapters/StreamsResponseAdapter";

export class ScoresResponseAdapter {
    id:string = "";
    score:number = 0.0;
    isregistered: boolean = false;
    date: number = 0;
    person : PersonResponseAdapter = new PersonResponseAdapter();
    streams: StreamsResponseAdapter = new StreamsResponseAdapter();
}