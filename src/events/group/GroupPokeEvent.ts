import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { Bot } from "../../hooks/Bot";
import { GroupEvent } from "./GroupEvent";

export class GroupPokeEvent extends GroupEvent {

    constructor(
        bot: Bot,
        group: Group,
        private sender: GroupMember,
        private target: GroupMember
    ) { super(bot, group); }

    public getSender() { return this.sender; }
    public getTarget() { return this.target; }

}