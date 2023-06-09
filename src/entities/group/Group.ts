
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

    private owner: GroupMember | undefined;
    private admins = new Array<GroupMember>();
    private members = new Array<GroupMember>();

    constructor(
        private bot: Bot,
        private group: GroupStruct,
    ) { }

    // 转为易读方法
    public getId() { return this.group.group_id; }
    public getName() { return this.group.group_name; }
    public getRemark() { return this.group.group_memo; }
    public getCreateTime() { return this.group.group_create_time; }
    public getLevel() { return this.group.group_level; }
    public getMemberCount() { return this.group.member_count; }
    public getMaxMemberCount() { return this.group.max_member_count; }

    public async getOwner() {
        if (!this.owner) await this.refresh();
        return this.owner;
    }
    public async getAdmins() {
        if (this.admins.length <= 0) await this.refresh();
        return this.admins;
    }
    public async getMembers() {
        if (this.members.length <= 0) await this.refresh();
        return this.members;
    }
    public async getMember(id: number) {
        return (await this.getMembers()).find((member) => member.getId() == id);
    }

    public deleteMember(id: number) {
        let index = this.members.findIndex((member) => member.getId() == id);
        if (index >= 0) this.members.splice(index, 1);
        let adminIndex = this.admins.findIndex((member) => member.getId() == id);
        if (adminIndex >= 0) this.admins.splice(adminIndex, 1);
    }

    public async refresh() {
        this.members = (await BotAPI.getGroupMembers(this.bot, this.getId()))!;
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