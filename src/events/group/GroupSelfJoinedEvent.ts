import { Group } from "../../entities/group/Group";
import { Bot } from "../../hooks/Bot";
import { GroupMemberJoinedEvent } from "./GroupMemberJoinedEvent";

export class GroupSelfJoinedEvent extends GroupMemberJoinedEvent {

    constructor(
        bot: Bot,
        group: Group
    ) { super(bot, group, group.getMember(bot.getId()!)!); }

}