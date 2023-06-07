import { WebSocket } from "../../entities/system/WebSocket";
import { WebSocketEvent } from "./WebSocketEvent";

/**
 * WebSocket 关闭连接事件
 * @extends WebSocketEvent
 */
export class WebSocketClosedEvent extends WebSocketEvent {

    private code: number;
    private description: string;

    constructor(webSocket: WebSocket, code: number, description: string) {
        super(webSocket);
        this.code = code;
        this.description = description;
    }

    public getCode() { return this.code; }
    public getDescription() { return this.description; }
    
}