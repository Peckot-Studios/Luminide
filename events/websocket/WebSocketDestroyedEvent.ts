import { WebSocket } from "../../entities/system/WebSocket";
import { WebSocketEvent } from "./WebSocketEvent";

/**
 * WebSocket 销毁事件
 * @extends WebSocketEvent
 */
export class WebSocketDestroyedEvent extends WebSocketEvent {

    constructor(
        webSocket: WebSocket
    ) { super(webSocket); }
    
}