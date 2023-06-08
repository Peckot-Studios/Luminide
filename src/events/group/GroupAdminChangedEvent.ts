import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { Bot } from "../../hooks/Bot";
import { GroupEvent } from "./GroupEvent";

/**
 * 群管理员变更操作
 * @enum
 */
export enum GroupAdminOperation {
    PROMOTE,
    DEMOTE
}

/**
 * 群管理员变更事件
 * @extends GroupEvent
 */
export class GroupAdminChangedEvent extends GroupEvent {

    private operation: GroupAdminOperation;

    constructor(
        bot: Bot,
        group: Group,
        private member: GroupMember,
        operation: GroupAdminOperation | string
    ) {
        super(bot, group);
        if (typeof operation === "string") {
            if (operation == "set") this.operation = GroupAdminOperation.PROMOTE;
            else this.operation = GroupAdminOperation.DEMOTE;
        } else this.operation = operation;
    }

    public getMember() { return this.member; }
    public getOperation() { return this.operation; }

}