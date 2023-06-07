/**
 * 匿名消息来源
 */
export class AnonymousSender {

    private id: number;
    private name: string;
    private flag: string;

    constructor(
        id: number,
        name: string,
        flag: string
    ) {
        this.id = id;
        this.name = name;
        this.flag = flag;
    }

    public getId() { return this.id; }
    public getName() { return this.name; }
    public getFlag() { return this.flag; }

    public toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this)}`; }

}