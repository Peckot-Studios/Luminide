import { MessageChain } from "../../entities/message/MessageChain";
import { Friend } from "../../entities/sender/Friend";
import { Bot } from "../../hooks/Bot";
import { FriendEvent } from "./FriendEvent";

export class FriendMessageEvent extends FriendEvent {

    constructor(
        bot: Bot,
        friend: Friend,
        private messageChain: MessageChain
    ) { super(bot, friend); }

    public getMessageChain() { return this.messageChain; }

}