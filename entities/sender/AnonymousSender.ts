/**
 * 匿名消息来源
 */
export class AnonymousSender {

    constructor(
        private id: number,
        private name: string,
        private flag: string
    ) { }

    public getId() { return this.id; }
    public getName() { return this.name; }
    public getFlag() { return this.flag; }

    public toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this)}`; }

}