import { StreamsResponseAdapter } from "../../streams/adapters/StreamsResponseAdapter";
import { PersonResponseAdapter } from "./PersonResponseAdapter";

export class PersonCamDoLiveAdapter {
    person: PersonResponseAdapter = new PersonResponseAdapter();
    stream: StreamsResponseAdapter = new StreamsResponseAdapter();
}