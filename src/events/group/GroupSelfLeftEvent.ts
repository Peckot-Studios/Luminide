import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { Bot } from "../../hooks/Bot";
import { GroupMemberLeftEvent } from "./GroupMemberLeftEvent";

/**
 * 机器人退出群聊事件
 * @extends GroupMemberLeftEvent
 */
export class GroupSelfLeftEvent extends GroupMemberLeftEvent {

    public static async create(
        bot: Bot,
        group: Group,
        ..._args: Array<any>
    ) { return new GroupSelfLeftEvent(bot, group, (await group.getMember(bot.getId()!))!); }

    protected constructor(
        bot: Bot,
        group: Group,
        member: GroupMember
    ) { super(bot, group, member); }

}