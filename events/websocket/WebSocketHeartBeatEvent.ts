import { WebSocket } from "../../entities/system/WebSocket";
import { WebSocketEvent } from "./WebSocketEvent";

/**
 * WebSocket 心跳事件
 * @extends WebSocketEvent
 */
export class WebSocketHeartBeatEvent extends WebSocketEvent {
    
    constructor(
        webSocket: WebSocket,
        private lastInterval: number
    ) { super(webSocket); }

    public getLastInterval() { return this.lastInterval; }
    
}