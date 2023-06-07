import { Version } from "../src/main/App";
import { FileClass } from "../tools/FileUtils";
import { Logger } from "../tools/Logger";



export function ErrorPrint(name: string, msg: string, data: string, logger?: Logger) {
    let date = new Date();
    let fileName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${date.getMilliseconds()}`;
    let dir = FileClass.getStandardPath(`./logs/Error/${fileName}.md`)!;
    let txt = [
        `# TMBot错误日志:`,
        `### 错误时间: ${fileName}`, ``,
        `#### Version: ${Version.version.join(".")}${Version.isBeta ? "Beta" : ""}`, ``,
        `## 错误名称:`,
        name, ``,
        `## 错误信息:`,
        msg, ``,
        `## 错误数据:`,
        data
    ].join("\n");
    FileClass.writeTo(dir, txt);
    if (!!logger) {
        logger.warn(`错误信息已输出至: ${dir}`);
    }
    return dir;
}