import { WebSocket } from "../../entities/system/WebSocket";
import { WebSocketEvent } from "./WebSocketEvent";

/**
 * WebSocket 消息事件
 * @extends WebSocketEvent
 */
export class WebSocketMessageEvent extends WebSocketEvent {

    private message: string;
    private buffer: boolean;

    constructor(webSocket: WebSocket, message: string | Buffer) {
        super(webSocket);
        this.message = typeof message === "string" ? message : message.toString("utf-8");
        this.buffer = typeof message !== "string";
    }

    public getMessage() { return this.message; }
    public isBuffer() { return this.buffer; }
    public getObject() {
        let data: any = null;
        try { data = JSON.parse(this.message); }
        finally { return data; }
    }

}