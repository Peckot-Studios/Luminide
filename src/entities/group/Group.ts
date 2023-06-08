
import { Bot, BotAPI } from "../../hooks/Bot";
import { GroupMember } from "./GroupMember";
import { GroupMemberPermission } from "./GroupMemberPermission";

/**
 * 群聊结构
 */
export type GroupStruct = {
    group_id: number,
    group_name: string,
    group_memo: string
    group_create_time?: number
    group_level?: number
    member_count?: number
    max_member_count?: number
}

/**
 * 群聊
 */
export class Group {

    private owner: GroupMember;
    private admins: Array<GroupMember>;
    private members: Array<GroupMember>;

    constructor(
        private bot: Bot,
        private group: GroupStruct
    ) {
        // 初始化
        this.members = BotAPI.getGroupMembersSync(this.bot, this.getId());
        this.admins = this.members.filter((member) => member.getPermission() == GroupMemberPermission.ADMIN);
        let owner = this.members.find((member) => member.getPermission() == GroupMemberPermission.OWNER);
        if (owner) this.owner = owner;
        else throw new Error(`群聊 ${this.getName()}(${this.getId()}) 初始化失败!`);
    }

    // 转为易读方法
    public getId() { return this.group.group_id; }
    public getName() { return this.group.group_name; }
    public getRemark() { return this.group.group_memo; }
    public getCreateTime() { return this.group.group_create_time; }
    public getLevel() { return this.group.group_level; }
    public getMemberCount() { return this.group.member_count; }
    public getMaxMemberCount() { return this.group.max_member_count; }

    public getOwner() { return this.owner; }
    public getAdmins() { return this.admins; }
    public getMembers() { return this.members; }
    public getMember(id: number) { return this.members.find((member) => member.getId() == id); }

    public async refresh() {
        this.members = (await BotAPI.getGroupMembers(this.bot, this.getId()));
        this.admins = this.members.filter((member) => member.getPermission() == GroupMemberPermission.ADMIN);
        let owner = this.members.find((member) => member.getPermission() == GroupMemberPermission.OWNER);
        if (owner) {
            this.owner = owner;
            return this;
        }
        else throw new Error(`群聊 ${this.getName()}(${this.getId()}) 加载失败!`);
    }

    public toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this.group)}`; }

}