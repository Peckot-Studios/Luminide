import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { MessageChain } from "../../entities/message/MessageChain";
import { Stranger } from "../../entities/sender/Stranger";
import { Bot } from "../../hooks/Bot";
import { GroupEvent } from "./GroupEvent";

/**
 * 群精华消息操作
 * @enum {string}
 */
export enum GroupEssenceMessageOperation {
    ADD = "add",
    DELETE = "delete"
}

/**
 * 群成员发送精华消息事件
 * @extends GroupEvent
 */
export class GroupEssenceMessageChangedEvent extends GroupEvent {

    private operation: GroupEssenceMessageOperation;

    constructor(
        bot: Bot,
        group: Group,
        private sender: Stranger,
        private operator: GroupMember,
        private message: MessageChain,
        operation: GroupEssenceMessageOperation | string
    ) {
        super(bot, group);
        if (typeof operation === "string") {
            if (operation == "add") this.operation = GroupEssenceMessageOperation.ADD;
            else this.operation = GroupEssenceMessageOperation.DELETE;
        } else this.operation = operation;
    }

    public getMessageSender() { return this.sender; }
    public getOperator() { return this.operator; }
    public getMessage() { return this.message; }
    public getOperation() { return this.operation; }

}