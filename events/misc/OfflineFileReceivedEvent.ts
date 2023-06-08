import { OfflineFile } from "../../entities/misc/OfflineFile";
import { Stranger } from "../../entities/sender/Stranger";
import { Bot } from "../../hooks/Bot";
import { BotEvent } from "../bot/BotEvent";

/**
 * 收到离线文件事件
 * @extends BotEvent
 */
export class OfflineFileReceivedEvent extends BotEvent {

    constructor(
        bot: Bot,
        private sender: Stranger,
        private file: OfflineFile
    ) { super(bot); }

    public getSender() { return this.sender; }
    public getFile() { return this.file; }

}