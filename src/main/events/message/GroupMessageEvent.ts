import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { MessageChain } from "../../entities/message/MessageChain";
import { AnonymousSender } from "../../entities/sender/AnonymousSender";
import { Sender } from "../../entities/sender/Sender";
import { MessageEvent } from "./MessageEvent";

/**
 * 群聊 Message 事件
 * @extends Event
 */
export class GroupMessageEvent extends MessageEvent {

    private group: Group;
    private member: GroupMember | AnonymousSender;

    constructor(messageChain: MessageChain, group: Group, member: GroupMember | AnonymousSender) {
        super(messageChain);
        this.group = group;
        this.member = member;
    }
    
    public getGroup() { return this.group; }
    public getMember() { return this.member; }
    public getSender() { return this.member as Sender; }
    public isAnonymous() { return this.member instanceof AnonymousSender; }

}