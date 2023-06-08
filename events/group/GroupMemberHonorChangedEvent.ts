import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { HonorType, HonorTypeStruct } from "../../entities/misc/HonorType";
import { Bot } from "../../hooks/Bot";
import { GroupEvent } from "./GroupEvent";

/**
 * 群成员荣誉变更事件
 * @extends GroupEvent
 */
export class GroupMemberHonorChangedEvent extends GroupEvent {

    constructor(
        bot: Bot,
        group: Group,
        private member: GroupMember,
        private honorType: HonorTypeStruct,
    ) { super(bot, group); }

    public getMember() { return this.member; }
    public getHonorType() { return HonorType.valueOf(this.honorType); }

}