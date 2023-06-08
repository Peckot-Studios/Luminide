import { MessageChain } from "../../entities/message/MessageChain";
import { Friend } from "../../entities/sender/Friend";
import { Bot } from "../../hooks/Bot";
import { FriendEvent } from "./FriendEvent";

/**
 * 好友消息撤回事件
 * @extends FriendEvent
 */
export class FriendMessageRecalledEvent extends FriendEvent {

    constructor(
        bot: Bot,
        friend: Friend,
        private messageChain: MessageChain
    ) { super(bot, friend); }

    public getMessageChain() { return this.messageChain; }

}