import { Bot, BotAPI } from "../../hooks/Bot";
import { Stranger } from "../sender/Stranger";
import { Group } from "./Group";
import { GroupMemberPermission } from "./GroupMemberPermission";

export type GroupMemberStruct = {
    user_id: number,
    nickname: string,
    sex: "male" | "female" | "unknown",
    age: number,
    level: number,
    // 相较于 Stranger 新增的属性
    group_id: number,
    card: string,
    role: "owner" | "admin" | "member",
    area: string,
    unfriendly: boolean,
    join_time: number,
    last_sent_time: number,
    title: string,
    title_expire_time: number,
    card_changeable: boolean,
    shut_up_timestamp: number
}

/**
 * 群聊成员
 */
export class GroupMember extends Stranger {

    private group: Group;

    constructor(
        bot: Bot,
        private groupMember: GroupMemberStruct
    ) {
        super(bot, (() => {
            let stranger = BotAPI.getStrangerStructSync(bot, groupMember.user_id);
            if (stranger) return stranger;
            else throw new Error(`群聊成员 ${groupMember.nickname}(${groupMember.user_id}) 初始化失败!`);
        })());
        let group = BotAPI.getGroupSync(bot, groupMember.group_id);
        if (group) this.group = group;
        else throw new Error(`群聊成员 ${this.getNickname()}(${this.getId()}) 初始化失败!`);
    }

    public getGroup() { return this.group; }

    public isUnfriendly() { return this.groupMember.unfriendly; }
    public isCardChangeable() { return this.groupMember.card_changeable; }
    public getCard() { return this.groupMember.card; }
    public getPermission() { return GroupMemberPermission.valueOf(this.groupMember.role); }
    public getArea() { return this.groupMember.area; }
    public getTitle() { return this.groupMember.title; }
    public getJoinTimestamp() { return this.groupMember.join_time; }
    public getLastSpeakTimestamp() { return this.groupMember.last_sent_time; }
    public getTitleExpireTimestamp() { return this.groupMember.title_expire_time; }
    public getUnmuteTimestamp() { return this.groupMember.shut_up_timestamp; }

    public async refresh() {
        let data = await BotAPI.getGroupMemberStruct(this.getBot(), this.getGroup().getId(), this.getId());
        if (data) this.groupMember = data;
    }

    override toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this.groupMember)}`; }

}