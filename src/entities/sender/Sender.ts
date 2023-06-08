import { Bot, BotAPI } from "../../hooks/Bot";
import { GroupMemberPermission } from "../group/GroupMemberPermission";
import { Sex } from "../misc/Sex";
import { Stranger } from "./Stranger";

/**
 * 发送者结构
 */
export type SenderStruct = {
    user_id: number,
    nickname: string,
    sex: "male" | "female" | "unknown",
    age: number,
    group_id?: number,
    card?: string,
    area?: string,
    level?: number,
    role?: "owner" | "admin" | "member",
    title?: string
}

/**
 * 发送者
 */
export class Sender extends Stranger {

    constructor(
        bot: Bot,
        private sender: SenderStruct
    ) {
        super(bot, BotAPI.getStrangerStructSync(bot, sender.user_id)!);
    }

    public getId() { return this.sender.user_id; }
    public getNickname() { return this.sender.nickname; }
    public getSex() { return Sex.valueOf(this.sender.sex); }
    public getAge() { return this.sender.age; }
    public getGroupId() { return this.sender.group_id; }
    public getCard() { return this.sender.card; }
    public getArea() { return this.sender.area; }
    public getPermission() { if (this.sender.role) return GroupMemberPermission.valueOf(this.sender.role); }
    public getTitle() { return this.sender.title; }

    public toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this.sender)}`; }

}