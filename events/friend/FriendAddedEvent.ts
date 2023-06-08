import { Friend } from "../../entities/sender/Friend";
import { Bot } from "../../hooks/Bot";
import { FriendEvent } from "./FriendEvent";

/**
 * 好友添加事件
 * @extends FriendEvent
 */
export class FriendAddedEvent extends FriendEvent {

    constructor(
        bot: Bot,
        friend: Friend
    ) { super(bot, friend); }

}