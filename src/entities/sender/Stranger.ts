import { Bot, BotAPI } from "../../hooks/Bot";
import { Sex } from "../misc/Sex";

/**
 * 陌生人结构
 */
export type StrangerStruct = {
    user_id: number,
    nickname: string,
    sex: "male" | "female" | "unknown",
    age: number,
    qid: string,
    level: number,
    login_days: number
}

/**
 * 陌生人
 */
export class Stranger {

    constructor(
        private bot: Bot,
        private stranger: StrangerStruct
    ) { }

    public getBot() { return this.bot; }

    public getId() { return this.stranger.user_id; }
    public getNickname() { return this.stranger.nickname; }
    public getSex() { return Sex.valueOf(this.stranger.sex); }
    public getAge() { return this.stranger.age; }
    public getQid() { return this.stranger.qid; }
    public getLevel() { return this.stranger.level; }
    public getLoginDays() { return this.stranger.login_days; }

    public async refresh() {
        let data = await BotAPI.getStrangerStruct(this.bot, this.getId());
        if (data) this.stranger = data;
    }

    public toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this.stranger)}`; }

}