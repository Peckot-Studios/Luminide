import { BotManager } from "./src/hooks/BotManager";
import { JsonConfigFileClass } from "./src/utils/DataUtils";
import { Logger } from "./src/entities/system/Logger";
import { PluginLoader } from "./src/plugins/PluginLoader";

let Logo = String.raw`
   __                _        _     __
  / /  __ __ __ _   (_)___   (_)___/ /___
 / /__/ // //  ' \ / // _ \ / // _  // -_)
/____/\_,_//_/_/_//_//_//_//_/ \_,_/ \__/

`;

let logger = new Logger("Luminide");

export let Version = {
    "version": [1, 0, 2],
    "isRemake": true,
    "isBeta": false,
    "isDebug": false
};

let Config = new JsonConfigFileClass("./config/config.json", JSON.stringify({
    "RoBot": {
        "Websocket": "ws://127.0.0.1:5555",
        "ReConnectCount": 5,
        "ReConnectTime": 4,
        "MsgLog": true,
        "NoticeLog": true,
        "LogFile": "luminlog-{Y}{M}{D}.log",
        "ChannelSystem": false
    }
}, null, 2));


process.on("uncaughtException", (err, _ori) => {
    logger.error(`程序出现未捕获的异常:`);
    logger.error(`Stack: ${err.stack}`);
    logger.errorPrint("Bot_Unknown_Error", "Unknown", `调用堆栈:
\`\`\`txt
${err.stack}
\`\`\`
`);
});

// process.on("uncaughtExceptionMonitor", (err, _ori) => {
//     logger.error(`程序出现未捕获的异常:`);
//     logger.error(`Stack: ${err.stack}`);
// });

async function loadPlugins() {
    await PluginLoader.loadAllPlugins();
}

async function load() {
    logger.info(Logo);
    logger.info(`正在初始化 Luminide Bot...`);
    logger.info(`开始批量连接 OneBot...`);
    let keys = Config.getKeys(), l = keys.length, i = 0;
    // console.log(conf.read())
    while (i < l) {
        let name = keys[i++];
        // console.log(name)
        try {
            let obj = Config.get(name);
            let ws = obj["Websocket"],
                reConnCount = obj["ReConnectCount"],
                reConnTime = obj["ReConnectTime"];
            if (ws.indexOf("ws://") != 0) {
                throw new Error(`Websocket连接必须以 [ws://] 开头!`);
            } else if (typeof (reConnCount) != "number") {
                throw new Error(`ReConnectCount(重连次数)参数必须为数字!`);
            } else if (typeof (reConnTime) != "number") {
                throw new Error(`ReConnectTime(重连时间)参数必须为数字!`);
            } else if (typeof (obj["MsgLog"]) != "boolean") {
                throw new Error(`MsgLog(消息日志开关)参数必须为布尔!`);
            } else if (typeof (obj["NoticeLog"]) != "boolean") {
                throw new Error(`NoticeLog(通知日志开关)参数必须为布尔!`);
            } else if (typeof (obj["LogFile"]) != "string" && obj["LogFile"] != null) {
                throw new Error(`LogFile(日志文件)参数必须为字符串或者null!`);
            } else if (typeof (obj["ChannelSystem"]) != "boolean") {
                throw new Error(`ChannelSystem(频道系统)参数必须为布尔!`);
            }
            await BotManager.newBot(name, ws, reConnCount, reConnTime, obj);
        } catch (e) {
            logger.error(`连接 [${name}] 失败!`);
            logger.error((e as Error).stack);
        }
    }
    await loadPlugins();
    logger.info('>> §6Luminide §rBot Started!');
    logger.info(`>> §eVersion: §r${Version.version.join(".")}remake`);
    logger.info(`>> §e${await fetch("https://v1.hitokoto.cn/?encode=text")}`);
}
load();