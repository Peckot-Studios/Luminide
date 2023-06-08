import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { Bot } from "../../hooks/Bot";
import { GroupSelfLeftEvent } from "./GroupSelfLeftEvent";

export class GroupSelfKickedEvent extends GroupSelfLeftEvent {

    constructor(
        bot: Bot,
        group: Group,
        private operator: GroupMember
    ) { super(bot, group); }

    public getOperator() { return this.operator; }

}