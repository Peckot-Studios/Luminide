import { Device } from "../../entities/system/Device";
import { WebSocket } from "../../entities/system/WebSocket";
import { WebSocketEvent } from "./WebSocketEvent";

/**
 * WebSocket 状态改变事件
 * @extends WebSocketEvent
 */
export class WebSocketStatusChangedEvent extends WebSocketEvent {

    constructor(
        webSocket: WebSocket,
        private device: Device,
        private online: boolean
    ) { super(webSocket); }

    public getDevice() { return this.device; }
    public isOnline() { return this.online; }
    
}