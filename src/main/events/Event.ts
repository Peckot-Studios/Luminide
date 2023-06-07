/**
 * 事件基类
 */
export class Event {

    private timestamp: number;

    constructor() {
        this.timestamp = Date.now();
    }

    public getTimestamp() { return this.timestamp; }
    public getEventName() { return this.constructor.name; }

}