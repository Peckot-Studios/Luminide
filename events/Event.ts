/**
 * 事件基类
 */
export class Event {

    constructor(private timestamp: number = Date.now()) { }

    public getTimestamp() { return this.timestamp; }
    public getEventName() { return this.constructor.name; }

}