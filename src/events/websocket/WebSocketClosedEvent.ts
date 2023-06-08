import { WebSocket } from "../../entities/system/WebSocket";
import { WebSocketEvent } from "./WebSocketEvent";

/**
 * WebSocket 关闭连接事件
 * @extends WebSocketEvent
 */
export class WebSocketClosedEvent extends WebSocketEvent {

    constructor(
        webSocket: WebSocket,
        private code: number,
        private description: string
    ) { super(webSocket); }

    public getCode() { return this.code; }
    public getDescription() { return this.description; }
    
}