import { MessageChain } from "../../entities/message/MessageChain";
import { Event } from "../Event";

/**
 * Message 事件
 * @extends Event
 */
export class MessageEvent extends Event {

    private messageChain: MessageChain;

    constructor(messageChain: MessageChain) {
        super();
        this.messageChain = messageChain;
    }

    public getMessageChain() { return this.messageChain; }

}