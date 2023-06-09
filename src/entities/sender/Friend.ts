import { Bot, BotAPI } from "../../hooks/Bot";
import { Stranger } from "./Stranger";

/**
 * 好友结构
 */
export type FriendStruct = {
    user_id: number,
    nickname: string,
    sex: "male" | "female" | "unknown",
    age: number,
    qid: string,
    level: number,
    login_days: number
    // 相较于 Stranger 新增的属性
    remark: string,
}

/**
 * 好友
 */
export class Friend extends Stranger {

    constructor(
        bot: Bot,
        private friend: FriendStruct
    ) { super(bot, friend); }

    public getRemark() { return this.friend.remark; }

    public toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this)}`; }
    
}