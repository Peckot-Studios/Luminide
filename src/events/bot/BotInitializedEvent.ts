import { Bot } from "../../hooks/Bot";
import { BotEvent } from "./BotEvent";

/**
 * Bot 初始化完成事件
 * @extends BotEvent
 */
export class BotInitializedEvent extends BotEvent {

    constructor(bot: Bot) { super(bot); }
    
}