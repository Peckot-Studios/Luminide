import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { Bot } from "../../hooks/Bot";
import { GroupEvent } from "./GroupEvent";

/**
 * 群成员成为拼手气红包运气王事件
 * @extends GroupEvent
 */
export class GroupMemberLuckyKingEvent extends GroupEvent {

    constructor(
        bot: Bot,
        group: Group,
        private packetSender: GroupMember,
        private member: GroupMember
    ) { super(bot, group); }

    public getPacketSender() { return this.packetSender; }
    public getMember() { return this.member; }

}