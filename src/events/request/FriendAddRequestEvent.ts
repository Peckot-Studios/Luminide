import { Stranger } from "../../entities/sender/Stranger";
import { Bot } from "../../hooks/Bot";
import { RequestEvent } from "./RequestEvent";

/**
 * 好友添加请求事件
 * @extends RequestEvent
 */
export class FriendAddRequestEvent extends RequestEvent {

    constructor(
        bot: Bot,
        sender: Stranger,
        message: string,
        flag: string
    ) { super(bot, sender, message, flag); }

}