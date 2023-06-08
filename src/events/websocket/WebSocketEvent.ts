import { WebSocket } from "../../entities/system/WebSocket";
import { Event } from "../Event";

/**
 * WebSocket 事件
 * @extends BotEvent
 */
export class WebSocketEvent extends Event {

    constructor(private webSocket: WebSocket) { super(); }

    public getWebSocket() { return this.webSocket; }
    
}