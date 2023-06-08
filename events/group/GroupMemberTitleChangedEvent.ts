import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { Bot } from "../../hooks/Bot";
import { GroupEvent } from "./GroupEvent";

/**
 * 群成员群头衔改变事件
 * @extends GroupEvent
 */
export class GroupMemberTitleChangedEvent extends GroupEvent {

    constructor(
        bot: Bot,
        group: Group,
        private member: GroupMember,
        private title: string
    ) { super(bot, group); }

    public getMember() { return this.member; }
    public getTitle() { return this.title; }

}