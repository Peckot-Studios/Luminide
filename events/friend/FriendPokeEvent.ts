import { Friend } from "../../entities/sender/Friend";
import { Bot } from "../../hooks/Bot";
import { FriendEvent } from "./FriendEvent";

export class FriendPokeEvent extends FriendEvent {

    constructor(
        bot: Bot,
        friend: Friend,
    ) { super(bot, friend); }

}