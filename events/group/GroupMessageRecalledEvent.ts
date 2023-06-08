import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { MessageChain } from "../../entities/message/MessageChain";
import { Bot } from "../../hooks/Bot";
import { GroupEvent } from "./GroupEvent";

export class GroupMessageRecalledEvent extends GroupEvent {

    constructor(
        bot: Bot,
        group: Group,
        private member: GroupMember,
        private operator: GroupMember,
        private messageChain: MessageChain
    ) { super(bot, group); }

    public getMember() { return this.member; }
    public getOperator() { return this.operator; }
    public getMessageChain() { return this.messageChain; }

}