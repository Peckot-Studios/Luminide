import { Bot } from "./Bot";
import { WebSocket } from "../entities/system/WebSocket";
import { EventManager } from "../events/EventManager";
import { WebSocketStartedEvent } from "../events/websocket/WebSocketStartedEvent";
import { WebSocketClosedEvent } from "../events/websocket/WebSocketClosedEvent";
import { WebSocketDestroyedEvent } from "../events/websocket/WebSocketDestroyedEvent";

let bots = new Map<string, Bot>();

export class BotManager {

    static newBot(
        name: string,
        connection: string,
        maxReconnectCount: number,
        maxReconnectTime: number,
        options: { [key: string]: any }
    ) {
        return new Promise<boolean>((respond) => {
            maxReconnectCount = parseInt(maxReconnectCount + "");
            maxReconnectTime = parseInt(maxReconnectTime + "");
            let eventManager = new EventManager();
            let webSocket = new WebSocket(connection, eventManager);
            let bot = new Bot(name, eventManager, webSocket, options);
            let logger = bot.getLogger();
            let reconnectCount = 0;
            let isFirst = true;
            let lock = true;
            let response = false;
            eventManager.registerEvent(WebSocketStartedEvent, (_event) => {
                reconnectCount = 0;
                isFirst = false; lock = false; response = true;
            });
            eventManager.registerEvent(WebSocketClosedEvent, (_event) => {
                if (bot.isClosing() || webSocket.isDestroyed()) return;
                if (isFirst) {
                    logger.info(`初次连接失败! 放弃重连!`);
                    webSocket.destroy();
                    lock = false;
                } else {
                    if (maxReconnectCount != 0) {
                        let time = (maxReconnectTime > 0 ? maxReconnectTime : 0);
                        if (reconnectCount >= maxReconnectCount) {
                            logger.warn(`重连次数耗尽! 自动关闭...`);
                            webSocket.destroy();
                            return;
                        }
                        logger.warn(`WebSocket连接断开! 将在${time}秒后重连! (${(reconnectCount + 1)}/${maxReconnectCount})`);
                        let timeout = (time * 1000) || 1;
                        setTimeout(() => {
                            logger.info("正在重连...");
                            webSocket.reconnect();
                        }, timeout);
                        reconnectCount += 1;
                    } else {
                        logger.warn(`WebSocket连接断开! 放弃重连!`);
                        webSocket.destroy();
                    }
                }

            });
            eventManager.registerEvent(WebSocketDestroyedEvent, (_event) => {
                logger.debug("销毁连接实例: ", name);
                bots.delete(name);
            });
            logger.debug("添加连接实例: ", name);
            bots.set(name, bot);
            let sid = setInterval(() => {
                if (!lock) { clearInterval(sid); respond(response); }
            }, 10);
        });
    }
    
    /**
     * 获取指定Bot实例
     * @param name Bot名称
     * @returns 指定Bot实例
     */
    static getBot(name: string) {
        return bots.get(name) || this.randomBot();
    }
    
    /**
     * 获取所有Bot实例
     * @returns 所有Bot实例
     */
    static getBots() {
        return Array.from(bots.values());
    }

    /**
     * 获取随机Bot实例
     * @returns 随机Bot实例
     */
    static randomBot() {
        if (bots.size == 0) { return null; }
        return this.getBots()[Math.floor(Math.random() * bots.size)];
    }
    
}