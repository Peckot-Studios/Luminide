import { Friend } from "../../entities/sender/Friend";
import { Bot } from "../../hooks/Bot";
import { BotEvent } from "../bot/BotEvent";

/**
 * 好友事件
 * @extends BotEvent
 */
export abstract class FriendEvent extends BotEvent {

    constructor(
        bot: Bot,
        private friend: Friend
    ) { super(bot); }

    public getFriend() { return this.friend; }

}