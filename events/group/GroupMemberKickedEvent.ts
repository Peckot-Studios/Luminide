import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { Bot } from "../../hooks/Bot";
import { GroupMemberLeftEvent } from "./GroupMemberLeftEvent";

/**
 * 群聊成员离开事件
 * @extends GroupMemberLeftEvent
 */
export class GroupMemberKickedEvent extends GroupMemberLeftEvent {

    constructor(
        bot: Bot,
        group: Group,
        member: GroupMember,
        private operator: GroupMember
    ) { super(bot, group, member); }

    public getOperator() { return this.operator; }

}