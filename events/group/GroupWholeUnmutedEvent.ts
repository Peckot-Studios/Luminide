import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { Bot } from "../../hooks/Bot";
import { GroupEvent } from "./GroupEvent";

/**
 * 群聊全体禁言事件
 * @extends GroupEvent
 */
export class GroupWholeUnmutedEvent extends GroupEvent {

    constructor(
        bot: Bot,
        group: Group,
        private operator: GroupMember,
    ) { super(bot, group); }

    public getOperator() { return this.operator; }

}