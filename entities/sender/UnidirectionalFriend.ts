import { Sender, SenderStruct } from "./Sender";
import { Bot } from "../../hooks/Bot";

/**
 * 单向好友
 * 抽象意义: 带有来源信息的账号
 */
export class UnidirectionalFriend extends Sender {

    constructor(
        bot: Bot,
        sender: SenderStruct,
        private source: string,
    ) { super(bot, sender); }

    public getSource() { return this.source; }

    public toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this)}`; }
    
}