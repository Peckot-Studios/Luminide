import { WebSocket } from "../../entities/system/WebSocket";
import { WebSocketEvent } from "../websocket/WebSocketEvent";

/**
 * WebSocket 生命周期事件
 * @extends WebSocketEvent
 */
export class WebSocketLifecycleEvent extends WebSocketEvent {

    private state: LifeCycleState;

    constructor(webSocket: WebSocket, state: LifeCycleState) {
        super(webSocket);
        this.state = state;
    }

    public getState() {
        return this.state;
    }
    
}

/**
 * 生命周期状态
 */
export enum LifeCycleState {
    ENABLE = "enable",
    DISABLE = "disable",
    CONNECT = "connect"
}