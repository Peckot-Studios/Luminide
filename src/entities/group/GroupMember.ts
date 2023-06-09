import { Bot, BotAPI } from "../../hooks/Bot";
import { Stranger, StrangerStruct } from "../sender/Stranger";
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

    public static async create(
        bot: Bot,
        groupMember: GroupMemberStruct
    ) {
        let group = await BotAPI.getGroup(bot, groupMember.group_id);
        let stranger = await BotAPI.getStrangerStruct(bot, groupMember.user_id);
        if (group && stranger) return new GroupMember(bot, stranger, groupMember, group);
        else throw new Error(`群聊成员 ${groupMember.nickname}(${groupMember.user_id}) 初始化失败!`);
    }

    constructor(
        bot: Bot,
        stranger: StrangerStruct,
        private member: GroupMemberStruct,
        private group: Group,
    ) { super(bot, stranger); }

    public getGroup() { return this.group; }

    public isUnfriendly() { return this.member.unfriendly; }
    public isCardChangeable() { return this.member.card_changeable; }
    public getCard() { return this.member.card; }
    public getPermission() { return GroupMemberPermission.valueOf(this.member.role); }
    public getArea() { return this.member.area; }
    public getTitle() { return this.member.title; }
    public getJoinTimestamp() { return this.member.join_time; }
    public getLastSpeakTimestamp() { return this.member.last_sent_time; }
    public getTitleExpireTimestamp() { return this.member.title_expire_time; }
    public getUnmuteTimestamp() { return this.member.shut_up_timestamp; }

    public async refresh() {
        let data = await BotAPI.getGroupMemberStruct(this.getBot(), this.getGroup().getId(), this.getId());
        if (data) this.member = data;
    }

    override toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this.member)}`; }

}