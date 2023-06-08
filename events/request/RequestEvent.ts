import { Stranger } from "../../entities/sender/Stranger";
import { Bot } from "../../hooks/Bot";
import { BotEvent } from "../bot/BotEvent";

/**
 * 请求事件
 * @extends BotEvent
 */
export abstract class RequestEvent extends BotEvent {

    constructor(
        bot: Bot,
        private sender: Stranger,
        private message: string,
        private flag: string
    ) { super(bot); }

    public getSender() { return this.sender; }
    public getMessage() { return this.message; }
    public getFlag() { return this.flag; }

}