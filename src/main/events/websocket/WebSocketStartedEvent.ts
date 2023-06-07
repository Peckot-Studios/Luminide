import { WebSocket } from "../../entities/system/WebSocket";
import { WebSocketEvent } from "./WebSocketEvent";

/**
 * WebSocket 开始连接事件
 * @extends WebSocketEvent
 */
export class WebSocketStartedEvent extends WebSocketEvent {

    constructor(webSocket: WebSocket) {
        super(webSocket);
    }
    
}