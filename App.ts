import axios from "axios";
import { BotManager } from "./src/hooks/BotManager";
import { JsonConfigFileClass } from "./src/utils/DataUtils";
import { Logger } from "./src/entities/system/Logger";
import { PluginLoader } from "./src/plugins/PluginLoader";

let logo = String.raw`
   __                _        _     __
  / /  __ __ __ _   (_)___   (_)___/ /___
 / /__/ // //  ' \ / // _ \ / // _  // -_)
/____/\_,_//_/_/_//_//_//_//_/ \_,_/ \__/
`;

let logger = new Logger("Luminide");

export let version = {
    code: [1, 0, 2],
    alhpa: true,
    beta: false
};

let config = new JsonConfigFileClass("./config.json", JSON.stringify({
    Bot: {
        debug: false,
        websocket: {
            address: "ws://localhost:5555",
            reconnect: 5,
            reconnect_time: 4
        },
        log: {
            file: "luminide-{Y}{M}{D}.log",
            message: true,
            notice: true,
        },
        //"ChannelSystem": false
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
    logger.info(`§6${logo}`);
    logger.info(`正在初始化 Luminide…`);
    logger.info(`开始批量连接 OneBot…`);
    let keys = config.getKeys(), l = keys.length, i = 0;
    // console.log(conf.read())
    while (i < l) {
        let name = keys[i++];
        // console.log(name)
        try {
            let options = config.get(name);
            let websocket = options["websocket"]["address"],
                reconnect = options["websocket"]["reconnect"],
                reconnectTime = options["websocket"]["reconnect_time"];
            if (websocket.indexOf("ws://") != 0) {
                throw new Error(`WebSocket连接地址必须以 [ws://] 开头!`);
            } else if (typeof (reconnect) != "number") {
                throw new Error(`配置 websocket.reconnect 应为整数!`);
            } else if (typeof (reconnectTime) != "number") {
                throw new Error(`配置 websocket.reconnect_time 应为整数!`);
            } else if (typeof (options["log"]["message"]) != "boolean") {
                throw new Error(`配置 log.message 应为布尔值!`);
            } else if (typeof (options["log"]["notice"]) != "boolean") {
                throw new Error(`配置 log.notice 应为布尔值!`);
            } else if (typeof (options["log"]["file"]) != "string" && options["log"]["file"] != null) {
                throw new Error(`配置 log.file 应为字符串或 null!`);
            }
            // else if (typeof (options["ChannelSystem"]) != "boolean") {
            //     throw new Error(`配置 ChannelSystem 应为布尔值!`);
            // }
            await BotManager.newBot(name, websocket, reconnect, reconnectTime, options);
        } catch (e) {
            logger.error(`连接 [${name}] 失败!`);
            logger.error((e as Error).stack);
            return;
        }
    }
    await loadPlugins();
    logger.info('>> §6Luminide §f启动成功!');
    logger.info(`>> §e当前版本: §f${version.code.join(".")}-${version.alhpa ? "§dAlpha" : version.beta ? "§3Beta" : "§eRelease"}`);
    logger.info(`>> §7『 ${Math.random() <= 0.1 ? (await axios.get("https://v1.hitokoto.cn/?encode=text")).data : "代码跑起来我们再聊。"} 』`);
}
load();