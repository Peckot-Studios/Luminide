import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { Bot } from "../../hooks/Bot";
import { GroupMemberJoinedEvent } from "./GroupMemberJoinedEvent";

export class GroupSelfJoinedEvent extends GroupMemberJoinedEvent {

    public static async create(
        bot: Bot,
        group: Group,
        ..._args: Array<any>
    ) { return new GroupSelfJoinedEvent(bot, group, (await group.getMember(bot.getId()!))!); }

    protected constructor(
        bot: Bot,
        group: Group,
        member: GroupMember
    ) { super(bot, group, member); }

}