import { Bot } from "../../hooks/Bot";

/**
 * 离线文件结构
 */
export type OfflineFileStruct = {
    name: string,
    size: number,
    url: string
}

/**
 * 离线文件
 */
export class OfflineFile {

    constructor(
        private bot: Bot,
        private file: OfflineFileStruct
    ) { }

    public getName() { return this.file.name; }
    public getSize() { return this.file.size; }
    public getUrl() { return this.file.url; }

    public toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this.file)}`; }

}