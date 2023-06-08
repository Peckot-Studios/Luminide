import { Bot } from "../../hooks/Bot";

/**
 * 群文件结构
 */
export type GroupFileStruct = {
    id: string,
    name: string,
    size: number,
    busid: number,
}

/**
 * 群文件
 */
export class GroupFile {

    constructor(
        private bot: Bot,
        private file: GroupFileStruct
    ) { }

    public getFileId() { return this.file.id; }
    public getName() { return this.file.name; }
    public getSize() { return this.file.size; }
    public getBusid() { return this.file.busid; }

    public toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this.file)}`; }

}