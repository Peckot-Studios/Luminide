import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { Bot } from "../../hooks/Bot";
import { GroupEvent } from "./GroupEvent";

/**
 * 群成员群名片改变事件
 * @extends GroupEvent
 */
export class GroupMemberCardChangedEvent extends GroupEvent {

    constructor(
        bot: Bot,
        group: Group,
        private member: GroupMember,
        private oldCard: string,
        private newCard: string
    ) { super(bot, group); }

    public getMember() { return this.member; }
    public getOldCard() { return this.oldCard; }
    public getNewCard() { return this.newCard; }

}