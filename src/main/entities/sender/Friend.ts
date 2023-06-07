import { Sender } from "./Sender";
import { Sex } from "../misc/Sex";

/**
 * 好友
 * 抽象意义: 带有备注的账号
 */
export class Friend extends Sender {

    private remark: string;

    constructor(
        id: number,
        nickname: string,
        remark: string,
        sex: Sex | string = Sex.UNKNOWN,
        age: number = 0,
        qid: string | null = null,
        level: number | null = null,
        loginDays: number | null = null,
    ) {
        super(id, nickname, sex, age, qid, level, loginDays);
        this.remark = remark;
    }

    public getRemark() { return this.remark; }

    public toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this)}`; }
    
}