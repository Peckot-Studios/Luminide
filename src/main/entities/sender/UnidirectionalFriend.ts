import { Sender } from "./Sender";
import { Sex } from "../misc/Sex";

/**
 * 单向好友
 * 抽象意义: 带有来源信息的账号
 */
export class UnidirectionalFriend extends Sender {

    private source: string;

    constructor(
        id: number,
        nickname: string,
        source: string,
        sex: Sex | string = Sex.UNKNOWN,
        age: number = 0,
        qid: string | null = null,
        level: number | null = null,
        loginDays: number | null = null,
    ) {
        super(id, nickname, sex, age, qid, level, loginDays);
        this.source = source;
    }

    public getSource() { return this.source; }

    public toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this)}`; }
    
}