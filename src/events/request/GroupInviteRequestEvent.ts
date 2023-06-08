import { Group } from "../../entities/group/Group";
import { Stranger } from "../../entities/sender/Stranger";
import { Bot } from "../../hooks/Bot";
import { RequestEvent } from "./RequestEvent";

/**
 * 邀请入群请求事件
 * @extends RequestEvent
 */
export class GroupInviteRequestEvent extends RequestEvent {

    constructor(
        bot: Bot,
        private group: Group,
        sender: Stranger,
        message: string,
        flag: string
    ) { super(bot, sender, message, flag); }

    public getGroup() { return this.group; }

}