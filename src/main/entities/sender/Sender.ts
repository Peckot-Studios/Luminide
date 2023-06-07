import { Sex } from "../misc/Sex";

/**
 * 消息来源
 */
export class Sender {

    private id: number;
    private nickname: string;
    private sex: Sex;
    private age: number;
    private qid: string | null;
    private level: number | null;
    private loginDays: number | null;

    constructor(
        id: number,
        nickname: string,
        sex: Sex | string = Sex.UNKNOWN,
        age: number = 0,
        qid: string | null = null,
        level: number | null = null,
        loginDays: number | null = null
    ) {
        this.id = id;
        this.nickname = nickname;
        this.sex = typeof sex === "string" ? Sex.valueOf(sex) : sex;
        this.age = age;
        this.qid = qid;
        this.level = level;
        this.loginDays = loginDays;
    }

    public getId() { return this.id; }
    public getNickname() { return this.nickname; }
    public getSex() { return this.sex; }
    public getAge() { return this.age; }
    public getQid() { return this.qid; }
    public getLevel() { return this.level; }
    public getLoginDays() { return this.loginDays; }

    public toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this)}`; }

}