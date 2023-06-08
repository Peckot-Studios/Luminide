import { Event } from "./Event";

/**
 * 事件监听器
 */
export class Listener {

    [handlerName: string]: any;

    private subscriptions: Array<{
        priority: EventPriority,
        triggers: Array<(new (...args: any) => Event)>,
        handler: (event: Event) => void | Promise<void>
    }> = [];

    public getSubscriptions() { return this.subscriptions; }
    public setSubscription(subscriptions: Array<{
        priority: EventPriority,
        triggers: Array<(new (...args: any) => Event)>,
        handler: (event: Event) => void | Promise<void>
    }>) { this.subscriptions = subscriptions; }

}

export function Subscribe(...events: (new () => Event)[]) {
    return function (target: Listener, propertyKey: string, _descriptor: PropertyDescriptor) {
        // 检测是否已经存在事件订阅信息
        let subscriptions = target.getSubscriptions();
        for (let i = 0; i < subscriptions.length; i++) {
            // 如果已经存在，则更新事件触发选项并返回
            if (subscriptions[i].handler.name == propertyKey) {
                subscriptions[i].triggers = events;
                target.setSubscription(subscriptions);
                return;
            }
        }
        // 如果不存在，则添加新的事件订阅信息
        subscriptions.push({
            priority: EventPriority.NORMAL,
            triggers: events,
            handler: target[propertyKey].bind(target)
        });
        target.setSubscription(subscriptions);
    };
}

export function Priority(priority: EventPriority) {
    return function (target: Listener, propertyKey: string, _descriptor: PropertyDescriptor) {
        // 检测是否已经存在事件订阅信息
        let subscriptions = target.getSubscriptions();
        for (let i = 0; i < subscriptions.length; i++) {
            // 如果已经存在，则更新事件触发选项并返回
            if (subscriptions[i].handler.name == propertyKey) {
                subscriptions[i].priority = priority;
                target.setSubscription(subscriptions);
                return;
            }
        }
        // 如果不存在，则添加新的事件订阅信息
        subscriptions.push({
            priority: EventPriority.NORMAL,
            triggers: [],
            handler: target[propertyKey].bind(target)
        });
        target.setSubscription(subscriptions);
    };
}

export enum EventPriority {
    MONITOR = 0,
    LOWEST = 1,
    LOW = 2,
    NORMAL = 3,
    HIGH = 4,
    HIGHEST = 5
}