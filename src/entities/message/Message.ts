import { Params } from "../../hooks/Bot";

/**
 * 消息片段
 */
export class Message {

    constructor(
        private type: string,
        private data: Params
    ) { }

    public getType() { return this.type; }
    public getData() { return this.data; }

}