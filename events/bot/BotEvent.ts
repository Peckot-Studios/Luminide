import { Bot } from "../../hooks/Bot";
import { Event } from "../Event";

/**
 * 机器人事件基类
 */
export class BotEvent extends Event {

    constructor(private bot: Bot) { super(); }

    public getBot() { return this.bot; }

}