import { PlataformsAdapter } from "./PlataformsAdapter";

export class StreamsResponseAdapter {
    idPublic: string = "";
    channel: string = "";
    plataformsAdapter: PlataformsAdapter = new PlataformsAdapter();
    isOnline: boolean = false;
}