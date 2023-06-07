import { WebSocket } from "../../entities/system/WebSocket";
import { Event } from "../Event";

/**
 * WebSocket 事件
 * @extends Event
 */
export class WebSocketEvent extends Event {

    private webSocket: WebSocket;

    constructor(webSocket: WebSocket) {
        super();
        this.webSocket = webSocket;
    }

    public getWebSocket() { return this.webSocket; }
    
}