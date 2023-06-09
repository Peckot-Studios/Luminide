import * as process from "process";
import * as fs from "fs";
import * as path from "path";
import { FileClass } from "../../utils/FileUtils";
import { version } from "../../../App";
// import { ServerPlayer } from "bdsx/bds/player";
// import { bedrockServer } from "bdsx/launcher";
// import { TextPacket } from "bdsx/bds/packets";


let Colors: { [key: string]: string } = {
    "§0": "\x1b[38;2;000;000;000m", // BLACK
    "§1": "\x1b[38;2;000;000;170m", // DARK_BLUE
    "§2": "\x1b[38;2;000;170;000m", // DARK_GREEN
    "§3": "\x1b[38;2;000;170;170m", // DARK_AQUA
    "§4": "\x1b[38;2;170;000;000m", // DARK_RED
    "§5": "\x1b[38;2;170;000;170m", // DARK_PURPLE
    "§6": "\x1b[38;2;255;170;000m", // GOLD
    "§7": "\x1b[38;2;170;170;170m", // GRAY
    "§8": "\x1b[38;2;085;085;085m", // DARK_GRAY
    "§9": "\x1b[38;2;085;085;255m", // BLUE
    "§a": "\x1b[38;2;085;255;085m", // GREEN
    "§b": "\x1b[38;2;085;255;255m", // AQUA
    "§c": "\x1b[38;2;255;085;085m", // RED
    "§d": "\x1b[38;2;255;085;255m", // LIGHT_PURPLE
    "§e": "\x1b[38;2;255;255;085m", // YELLOW
    "§f": "\x1b[38;2;255;255;255m", // WHITE
    "§g": "\x1b[38;2;221;214;005m", // MINECOIN_GOLD
    "§l": "\x1b[1m", // BOLD
    "§o": "\x1b[3m", // ITALIC
    "§k": "",        // OBFUSCATED
    "§r": "\x1b[0m", // RESET
    "§": "",         //ESCAPE
};


function getColor(...args: string[]): string {
    return "\u001b[" + args.join(";") + "m";
}

function AutoReplace(OriText: string, ...args: string[]): string {
    while (args.length != 0) {
        let thisArg: string | undefined = args.shift();
        if (thisArg != undefined) {
            OriText = OriText.replace("{}", thisArg);
        }
    }
    return OriText;
}


function DateToString(date: Date): string {
    let toFull = (val: number): string => {
        if (val > 9) {
            return val.toString();
        } else {
            return `0${val.toString()}`;
        }
    };
    return AutoReplace("{}-{}-{} {}:{}:{}",
        date.getFullYear().toString(), toFull(date.getMonth() + 1), toFull(date.getDate()),
        toFull(date.getHours()), toFull(date.getMinutes()), toFull(date.getSeconds())
    );
}

function mkdirSync(dirname: string) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
        } else {
            fs.mkdirSync(path.dirname(dirname));
        }
        return true;
    }
}

export enum LoggerLevel {
    SILENT, FATAL, ERROR, WARN, INFO, DEBUG
}

function ReplaceDate(str: string) {
    let date = new Date();
    let toFull = (val: number): string => {
        if (val > 9) {
            return val.toString();
        } else {
            return `0${val.toString()}`;
        }
    };
    let MAP: { [key: string]: any } = {
        "{Y}": date.getFullYear() + "",
        "{M}": toFull(date.getMonth() + 1) + "",
        "{D}": toFull(date.getDate()) + ""
    };
    let keys = Object.keys(MAP), i = 0, l = keys.length;
    while (i < l) {
        let key = keys[i++];
        while (str.includes(key)) {
            str = str.replace(key, MAP[key]);
        }
    }
    return str;
}


export class Logger {
    #Title: string; #isSyncOutput: boolean;
    #Config: { "Console": { "level": LoggerLevel, "Enable": Boolean }, "File": { "level": LoggerLevel, "path": string }, "Player": { "level": LoggerLevel, "xuid": string } | null | undefined };
    #UsePlayer: boolean = true; #LogOp: (type: LoggerLevel, text: string) => void;
    constructor(title: string = "", level: number = 4, isSyncOutput: boolean = true) {
        this.#Title = "";
        this.setTitle(title);
        this.#isSyncOutput = isSyncOutput;
        this.#Config = { "Console": { "Enable": true, "level": level }, "File": { "path": "", "level": level }, "Player": null };
        if (this.#UsePlayer) {
            this.#Config.Player = { "level": level, "xuid": "" };
        }
        this.#Config.Console = { "level": level, "Enable": true };
        this.#Config.File = { "level": level, "path": "" };
        this.#LogOp = (type: LoggerLevel, text: string) => {
            var dateString = DateToString(new Date());
            var typeColor: string = "38;2;255;255;255";
            var typeString: string = "";
            var lineColor: string = "";
            switch (type) {
                case LoggerLevel.SILENT: typeString = "SILENT"; return;
                case LoggerLevel.FATAL: typeString = "FATL"; typeColor = "38;2;255;0;0"; lineColor = "§4"; break;
                case LoggerLevel.ERROR: typeString = "ERRR"; typeColor = "38;2;239;46;46"; lineColor = "§c"; break;
                case LoggerLevel.WARN: typeString = "WARN"; typeColor = "38;2;255;255;0"; lineColor = "§e"; break;
                case LoggerLevel.INFO: typeString = "INFO"; typeColor = "38;2;255;255;255"; lineColor = "§f"; break;
                case LoggerLevel.DEBUG: typeString = "DEBG"; typeColor = "1;38;2;0;255;255"; lineColor = "§o"; break;
            }
            var NoColorLogStr: string = AutoReplace("[{} {}] {} {}",
                dateString, typeString,
                (this.#Title == "" ? "" : AutoReplace("[{}]", this.#Title)),
                text
            );
            var ColorLogStr: string = AutoReplace("{}{} {}{} {}{} {}{}",
                getColor("38", "2", "173", "216", "230"), // 时间颜色
                dateString.split(" ")[1], // 时间
                getColor((type == LoggerLevel.INFO ? "38;2;0;170;170" : typeColor)), // 日志级别颜色
                typeString, // 日志级别
                getColor(typeColor), // 日志颜色
                (this.#Title != "" ? `[${this.#Title}]` : ""), // 日志头
                text, // 日志内容
                getColor("0") // 重置颜色
            );
            var consolePrint: () => void = () => {
                if (type <= this.#Config.Console.level) {
                    let consoleLog = ColorLogStr;
                    let keys = Object.keys(Colors), l = keys.length, i = 0;
                    while (i < l) {
                        let nowKey = keys[i];
                        let nowVal = Colors[nowKey];
                        while (consoleLog.indexOf(nowKey) != -1) {
                            consoleLog = consoleLog.replace(nowKey, nowVal);
                        }
                        i++;
                    }
                    console.log(consoleLog);
                }
            };
            if (this.#isSyncOutput) {
                consolePrint();
            } else {
                process.nextTick(consolePrint);
            }
            if (this.#Config.File.path != "" && type <= this.#Config.File.level) {
                let dirName = path.dirname(this.#Config.File.path);
                mkdirSync(dirName);
                fs.appendFileSync(dirName + ReplaceDate(this.#Config.File.path.replace(dirName, "")), NoColorLogStr + "\n");
            }
            if (this.#UsePlayer) {
                // if (this.#Config.Player != null) {
                //     if (this.#Config.Player.xuid != "" && type <= this.#Config.Player.level) {


                //         let sp = bedrockServer.level.getPlayerByXuid(this.#Config.Player.xuid);
                //         if (sp != null) {
                //             let pkt = TextPacket.allocate();
                //             pkt.type = TextPacket.Types.Raw;
                //             pkt.message = plColor + NoColorLogStr;
                //             sp.sendPacket(pkt);
                //             pkt.destruct();
                //         } else { this.#Config.Player.xuid = ""; }
                //     }
                // }
            }
        };
    };
    setTitle(title: string = ""): boolean {
        this.#Title = title;
        return true;
    };
    setLogLevel(level: number | LoggerLevel = 4): boolean {
        if (this.#UsePlayer) {
            if (this.#Config.Player != null) {
                this.#Config.Player.level = level;
            }
        }
        this.#Config.Console.level = level;
        this.#Config.File.level = level;
        return true;
    };
    setConsole(enable: boolean, level: number | LoggerLevel = 4): boolean {
        this.#Config.Console.Enable = enable;
        this.#Config.Console.level = level;
        return true;
    };
    setFile(path: string, level: number | LoggerLevel = 4): boolean {
        this.#Config.File.path = FileClass.getStandardPath(path)!;
        this.#Config.File.level = level;
        return true;
    };
    // setPlayer(pl: ServerPlayer, level: number = 4): boolean {
    //     if (pl == null) {
    //         return false;
    //     }
    //     if (this.#Config.Player == null) { return false; }
    //     this.#Config.Player.xuid = pl.getXuid();
    //     this.#Config.Player.level = level;
    //     return true;
    // };
    log(...args: any[]): boolean {
        this.#LogOp(LoggerLevel.INFO, args.join(""));
        return true;
    };
    info(...args: any[]): boolean {
        this.#LogOp(LoggerLevel.INFO, args.join(""));
        return true;
    };
    debug(...args: any[]): boolean {
        this.#LogOp(LoggerLevel.DEBUG, args.join(""));
        return true;
    };
    warn(...args: any[]): boolean {
        this.#LogOp(LoggerLevel.WARN, args.join(""));
        return true;
    };
    error(...args: any[]): boolean {
        this.#LogOp(LoggerLevel.ERROR, args.join(""));
        return true;
    };
    fatal(...args: any[]): boolean {
        this.#LogOp(LoggerLevel.FATAL, args.join(""));
        return true;
    };
    errorPrint(name: string, msg: string, data: string) {
        let date = new Date();
        let fileName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${date.getMilliseconds()}`;
        let dir = FileClass.getStandardPath(`./logs/Error/${fileName}.md`)!;
        let txt = [
            `# Luminide 错误日志:`,
            `### 错误时间: ${fileName}`,
            `### Version: ${version.code.join(".")} ${version.alhpa ? "Alpha" : version.beta ? "Beta" : ""}`,
            `## 错误名称:`, name,
            `## 错误信息:`, msg,
            `## 错误数据:`, data
        ].join("\n");
        FileClass.writeTo(dir, txt);
        this.warn(`错误信息已输出至: ${dir}`);
        return dir;
    }
}