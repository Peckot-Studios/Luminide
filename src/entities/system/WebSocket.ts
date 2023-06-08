import { WebSocket as WS } from "ws";
import { Logger } from "./Logger";
import { EventManager } from "../../events/EventManager";
import { WebSocketStartedEvent } from "../../events/websocket/WebSocketStartedEvent";
import { WebSocketMessageEvent } from "../../events/websocket/WebSocketMessageEvent";
import { WebSocketClosedEvent } from "../../events/websocket/WebSocketClosedEvent";
import { WebsocketErrorEvent } from "../../events/websocket/WebSocketErrorEvent";
import { WebSocketDestroyedEvent } from "../../events/websocket/WebSocketDestroyedEvent";

let logger = new Logger("WebSocket", 4);

export class WebSocket {

    private client: WS;
    private destroyed = false;
    private connect: string;

    private eventManager: EventManager;
    
    constructor(connect: string, eventManager: EventManager) {
        this.connect = connect;
        this.client = new WS(connect);
        this.eventManager = eventManager;
        this._initialize();
    }

    public getClient() { return this.client; }
    public isDestroyed() { return this.destroyed; }

    public reconnect() {
        this.client.close();
        this.client = new WS(this.connect);
        this._initialize();
    }

    private _initialize() {
        this.client.onopen = (_e) => {
            logger.info("服务器连接成功!");
            this.eventManager.callEvent(new WebSocketStartedEvent(this));
        };
        this.client.onmessage = (e) => {
            this.eventManager.callEvent(new WebSocketMessageEvent(this, e.data as string | Buffer));
        };
        this.client.onclose = (e) => {
            this.eventManager.callEvent(new WebSocketClosedEvent(this, e.code, e.reason));
        };
        this.client.onerror = (e) => {
            this.eventManager.callEvent(new WebsocketErrorEvent(this, e.error as Error));
        };
    }
    
    /**
     * 发送数据
     */
    public send(msg: string | Buffer) {
        // if (!this._conn) { return false; }
        // this._conn.send(msg, (err) => { if (!!err) { this._events.onError.fire("WebsocketProcessSendError", err); } });
        // this._conn.send(msg);
        this.client.send(msg);
    }

    /**
     * 关闭连接
     */
    public close(code: number = 1000) {
        // if (!this._conn) { return false; }
        // logger.info("Close Code:", code);
        // this._conn.close(code, "NORMAL");
        // this._conn.close(code);
        this.client.close(code);
        return true;
    }

    /**
     * 销毁连接 (不可逆)
     */
    public destroy(code: number = 1000) {
        this.eventManager.callEvent(new WebSocketDestroyedEvent(this));
        this.destroyed = true;
        this.close(code);
        return true;
    }

}