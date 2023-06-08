import { MessageChain } from "../../entities/message/MessageChain";
import { Stranger } from "../../entities/sender/Stranger";
import { Bot } from "../../hooks/Bot";
import { BotEvent } from "../bot/BotEvent";

/**
 * 陌生人消息事件
 * @extends BotEvent
 */
export class StrangerMessageEvent extends BotEvent {

    constructor(
        bot: Bot,
        private stranger: Stranger,
        private messageChain: MessageChain
    ) { super(bot); }

    public getStranger() { return this.stranger; }
    public getMessageChain() { return this.messageChain; }

}