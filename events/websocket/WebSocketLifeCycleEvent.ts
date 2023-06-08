import { WebSocket } from "../../entities/system/WebSocket";
import { WebSocketEvent } from "../websocket/WebSocketEvent";

/**
 * WebSocket 生命周期事件
 * @extends WebSocketEvent
 */
export class WebSocketLifecycleEvent extends WebSocketEvent {

    private state: LifeCycleState;

    constructor(
        webSocket: WebSocket,
        state: LifeCycleState | string
    ) {
        super(webSocket);
        this.state = typeof state === "string" ? LifeCycleState.valueOf(state) : state;
    }

    public getState() { return this.state; }
    
}

/**
 * 生命周期状态
 * @enum {string}
 */
export enum LifeCycleState {
    ENABLE = "enable",
    DISABLE = "disable",
    CONNECT = "connect"
}

export namespace LifeCycleState {
    export function valueOf(string: string) {
        switch (string) {
            case "enable": return LifeCycleState.ENABLE;
            case "disable": return LifeCycleState.DISABLE;
            case "connect": return LifeCycleState.CONNECT;
            default: throw new Error(`未找到对应的生命周期状态: ${string}`);
        }
    }
}