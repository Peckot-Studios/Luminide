import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { Bot } from "../../hooks/Bot";
import { GroupEvent } from "./GroupEvent";

/**
 * 群聊成员被禁言事件
 * @extends GroupEvent
 */
export class GroupMemberMutedEvent extends GroupEvent {

    constructor(
        bot: Bot,
        group: Group,
        private member: GroupMember,
        private operator: GroupMember,
        private duration: number
    ) { super(bot, group); }

    public getMember() { return this.member; }
    public getOperator() { return this.operator; }
    /**
     * 获取禁言时长
     * @returns 禁言时长, 单位: 秒
     */
    public getDuration() { return this.duration; }

}