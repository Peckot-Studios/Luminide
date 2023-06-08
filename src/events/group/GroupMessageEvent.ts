import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { MessageChain } from "../../entities/message/MessageChain";
import { AnonymousSender } from "../../entities/sender/AnonymousSender";
import { Bot } from "../../hooks/Bot";
import { GroupEvent } from "./GroupEvent";

/**
 * 群聊消息事件
 * @extends MessageEvent
 */
export class GroupMessageEvent extends GroupEvent {

    constructor(
        bot: Bot,
        group: Group,
        private member: GroupMember | AnonymousSender,
        private messageChain: MessageChain
    ) { super(bot, group); }

    public isAnonymous() { return this.member instanceof AnonymousSender; }
    public getMember() { return this.member; }
    public getMessageChain() { return this.messageChain; }

}