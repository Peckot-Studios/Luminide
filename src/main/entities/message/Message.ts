import { Params } from "../../hooks/Bot";

export class Message {

    private type: string;
    private data: Params;

    constructor(type: string, data: Params) {
        this.type = type;
        this.data = data;
    }

    public getType() { return this.type; }
    public getData() { return this.data; }

}