import { Bot } from "../../hooks/Bot";

/**
 * 消息链结构
 */
export type MessageChainStruct = {
    message_id: number,
    message: string,
    raw_message: string
}

/**
 * 消息链
 */
export class MessageChain {

    constructor(
        private bot: Bot,
        private messageChain: MessageChainStruct
    ) { }
    
    public getMessageId() { return this.messageChain.message_id; }
    public getContent() {
        return this.messageChain.raw_message
            .replace(/&amp\;/g, "&")
            .replace(/&#91\;/g, "[")
            .replace(/&#93\;/g, "]")
            .replace(/&#44\;/g, ",");
    }
    
    public toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this.messageChain)}`; }

}