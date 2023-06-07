import { Message } from "./Message";

/**
 * 消息链
 */
export class MessageChain {

    private id: number;
    private messages = new Array<Message>();
    private raw: string;

    constructor(
        id: number,
        messages: Array<Message>,
        raw: string
    ) {
        this.id = id;
        this.messages = messages;
        this.raw = raw;
    }
    
    public getId() { return this.id; }
    public getMessages() { return this.messages; }
    public getContent() {
        return this.raw
            .replace(/&amp\;/g, "&")
            .replace(/&#91\;/g, "[")
            .replace(/&#93\;/g, "]")
            .replace(/&#44\;/g, ",");
    }
    
    toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this)}`; }

}