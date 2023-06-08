import { Group } from "../../entities/group/Group";
import { GroupFile } from "../../entities/group/GroupFile";
import { GroupMember } from "../../entities/group/GroupMember";
import { Bot } from "../../hooks/Bot";
import { GroupEvent } from "./GroupEvent";

/**
 * 群文件上传事件
 * @extends GroupEvent
 */
export class GroupFileUploadEvent extends GroupEvent {

    constructor(
        bot: Bot,
        group: Group,
        private member: GroupMember,
        private file: GroupFile
    ) { super(bot, group); }

    public getMember() { return this.member; }
    public getFile() { return this.file; }

}