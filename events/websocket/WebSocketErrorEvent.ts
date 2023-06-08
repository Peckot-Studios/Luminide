import { WebSocket } from "../../entities/system/WebSocket";
import { WebSocketEvent } from "./WebSocketEvent";

/**
 * WebSocket 错误事件
 * @extends WebSocketEvent
 */
export class WebsocketErrorEvent extends WebSocketEvent {

    constructor(
        webSocket: WebSocket,
        private error: Error
    ) { super(webSocket); }

    public getError() { return this.error; }
    
}