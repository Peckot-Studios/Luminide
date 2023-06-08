import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { Bot } from "../../hooks/Bot";
import { GroupEvent } from "./GroupEvent";

/**
 * 群成员加入事件
 * @extends GroupEvent
 */
export class GroupMemberJoinedEvent extends GroupEvent {

    constructor(
        bot: Bot,
        group: Group,
        private member: GroupMember
    ) { super(bot, group); }

    public getMember() { return this.member; }

}