import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { Bot } from "../../hooks/Bot";
import { GroupSelfLeftEvent } from "./GroupSelfLeftEvent";

export class GroupSelfKickedEvent extends GroupSelfLeftEvent {

    static override async create(
        bot: Bot,
        group: Group,
        operator: GroupMember,
        ..._args: Array<any>
    ) { return new GroupSelfKickedEvent(bot, group, (await group.getMember(bot.getId()!))!, operator); }

    protected constructor(
        bot: Bot,
        group: Group,
        member: GroupMember,
        private operator: GroupMember
    ) { super(bot, group, member); }

    public getOperator() { return this.operator; }

}