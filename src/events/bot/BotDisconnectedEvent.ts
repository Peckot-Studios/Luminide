import { Bot } from "../../hooks/Bot";
import { BotEvent } from "./BotEvent";

/**
 * Bot 断开连接事件
 * @extends BotEvent
 */
export class BotDisconnectedEvent extends BotEvent {

    constructor(bot: Bot) { super(bot); }
    
}