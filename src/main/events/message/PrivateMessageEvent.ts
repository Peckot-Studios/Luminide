import { MessageChain } from "../../entities/message/MessageChain";
import { Sender } from "../../entities/sender/Sender";
import { MessageEvent } from "./MessageEvent";

/**
 * 私聊 Message 事件
 * @extends Event
 */
export class PrivateMessageEvent extends MessageEvent {

    private sender: Sender;

    constructor(messageChain: MessageChain, sender: Sender) {
        super(messageChain);
        this.sender = sender;
    }
    
    public getSender() { return this.sender; }

}