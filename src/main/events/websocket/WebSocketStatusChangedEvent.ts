import { Device } from "../../entities/system/Device";
import { WebSocket } from "../../entities/system/WebSocket";
import { WebSocketEvent } from "./WebSocketEvent";

/**
 * WebSocket 状态改变事件
 * @extends WebSocketEvent
 */
export class WebSocketStatusChangedEvent extends WebSocketEvent {

    private device: Device;
    private online: boolean;

    constructor(webSocket: WebSocket, device: Device, online: boolean) {
        super(webSocket);
        this.device = device;
        this.online = online;
    }

    public getDevice() { return this.device; }
    public isOnline() { return this.online; }
    
}