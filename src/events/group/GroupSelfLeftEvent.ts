import { Group } from "../../entities/group/Group";
import { Bot } from "../../hooks/Bot";
import { GroupMemberLeftEvent } from "./GroupMemberLeftEvent";

/**
 * 机器人退出群聊事件
 * @extends GroupMemberLeftEvent
 */
export class GroupSelfLeftEvent extends GroupMemberLeftEvent {

    constructor(
        bot: Bot,
        group: Group
    ) { super(bot, group, group.getMember(bot.getId()!)!); }

}