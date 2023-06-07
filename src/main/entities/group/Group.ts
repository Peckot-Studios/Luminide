
import { Bot, BotAPI } from "../../hooks/Bot";
import { GroupBase } from "./GroupBase";
import { GroupMember } from "./GroupMember";
import { GroupMemberPermission } from "./GroupMemberPermission";

/**
 * 群聊
 */
export class Group extends GroupBase {

    private bot: Bot;

    private owner: GroupMember;
    private admins: Array<GroupMember>;
    private members: Array<GroupMember>;

    constructor(
        bot: Bot,
        id: number,
        name: string,
        remark: string,
        createTime: number | null = null,
        level: number | null = null,
        memberCount: number | null = null,
        maxMemberCount: number | null = null
    ) {
        super(id, name, remark, createTime, level, memberCount, maxMemberCount)
        this.bot = bot;
        this.members = BotAPI.getGroupMembersSync(this.bot, this.getId());
        this.admins = this.members.filter((member) => member.getPermission() == GroupMemberPermission.ADMIN);
        let owner = this.members.find((member) => member.getPermission() == GroupMemberPermission.OWNER);
        if (owner) this.owner = owner;
        else throw new Error(`群聊 ${this.getName()}(${this.getId()}) 初始化失败!`);
    }

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

}