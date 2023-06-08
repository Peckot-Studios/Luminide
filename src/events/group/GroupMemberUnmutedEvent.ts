import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { Bot } from "../../hooks/Bot";
import { GroupEvent } from "./GroupEvent";

/**
 * 群聊成员被解除禁言事件
 * @extends GroupEvent
 */
export class GroupMemberUnmutedEvent extends GroupEvent {

    constructor(
        bot: Bot,
        group: Group,
        private member: GroupMember,
        private operator: GroupMember
    ) { super(bot, group); }

    public getMember() { return this.member; }
    public getOperator() { return this.operator; }

}