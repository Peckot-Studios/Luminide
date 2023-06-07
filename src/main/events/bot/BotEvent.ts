import { Bot } from "../../hooks/Bot";
import { BotManager } from "../../hooks/BotManager";
import { Event } from "../Event";

/**
 * Bot 事件
 * @extends Event
 */
export class BotEvent extends Event {
    private bot: Bot;
    constructor(bot: Bot | string | null) {
        super();
        if (bot instanceof Bot) {
            this.bot = bot;
        } else if (typeof bot == "string") {
            bot = BotManager.getBot(bot);
            if (!bot) throw new Error(`初始化 BotEvent 失败! Bot[${bot}] 不存在!`);
            this.bot = bot;
        } else {
            bot = BotManager.randomBot();
            if (!bot) throw new Error(`初始化 BotEvent 失败! Bot 不存在!`);
            this.bot = bot;
        }
    }
    public getBot() {
        return this.bot;
    }
}