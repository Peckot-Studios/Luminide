import { Group } from "../../entities/group/Group";
import { Bot } from "../../hooks/Bot";
import { BotEvent } from "../bot/BotEvent";

/**
 * 群聊事件
 * @extends BotEvent
 */
export abstract class GroupEvent extends BotEvent {

    constructor(
        bot: Bot,
        private group: Group
    ) {
        super(bot);
    }

    public getGroup() { return this.group; }

}