import { WebSocket } from "../../entities/system/WebSocket";
import { WebSocketEvent } from "./WebSocketEvent";

/**
 * WebSocket 错误事件
 * @extends WebSocketEvent
 */
export class WebsocketErrorEvent extends WebSocketEvent {

    private error: Error;

    constructor(webSocket: WebSocket, error: Error) {
        super(webSocket);
        this.error = error;
    }

    public getError() { return this.error; }
    
}