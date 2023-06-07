import { WebSocket } from "../../entities/system/WebSocket";
import { WebSocketEvent } from "./WebSocketEvent";

/**
 * WebSocket 心跳事件
 * @extends WebSocketEvent
 */
export class WebSocketHeartBeatEvent extends WebSocketEvent {

    private lastInterval: number;

    constructor(webSocket: WebSocket, lastInterval: number) {
        super(webSocket);
        this.lastInterval = lastInterval;
    }

    public getLastInterval() { return this.lastInterval; }
    
}