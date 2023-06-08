import { EventPriority } from "./Listener";
import { Event } from "./Event";
import { Logger } from "../entities/system/Logger";
import { Listener } from "./Listener";

const logger = new Logger("EventManager");

export class EventManager {
    
    // Map<事件名称, Array<事件处理程序>>
    // Array sorted by priority
    private eventHandlers = new Map<(new (...args: any) => Event), Array<{
        priority: EventPriority,
        call: <T extends Event>(event: T) => void | Promise<void>
    }>>();

    /**
     * 触发事件
     * @param event 事件
     */
    public async callEvent(event: Event) {
        logger.debug(`Event ${event.constructor.name} called`);
        for (const eventHandler of this.eventHandlers) {
            if (eventHandler[0].name == event.constructor.name) {
                for (const handler of eventHandler[1]) {
                    await handler.call(event);
                }
                return;
            }
        }
    }

    /**
     * 注册监听器
     * @param listener 监听器
     */
    public registerListener(listener: Listener) {
        const subscriptions = listener.getSubscriptions();
        if (subscriptions) {
            for (const subscription of subscriptions) {
                const { priority, triggers, handler } = subscription;
                // 遍历所有触发器 并将 handler 插入
                for (const trigger of triggers) {
                    logger.debug(`Listener ${listener.constructor.name} registered for ${trigger.name}`);
                    if (!this.eventHandlers.get(trigger)) {
                        this.eventHandlers.set(trigger, []);
                    }
                    // 按照 priority 排序并插入 handler
                    const handlers = this.eventHandlers.get(trigger)!;
                    handlers.push({ priority: priority, call: handler });
                    handlers.sort((a, b) => b.priority - a.priority);
                    this.eventHandlers.set(trigger, handlers);
                }
            }
        }
        logger.debug(`Listener ${listener.constructor.name} registered`);
    }

    /**
     * 注销监听器
     * @param listener 监听器
     */
    public unregisterListener(listener: Listener) {
        const subscriptions = listener.getSubscriptions();
        if (subscriptions) {
            for (const subscription of subscriptions) {
                const { triggers, handler } = subscription;
                // 遍历所有触发器 并将 handler 删除
                for (const trigger of triggers) {
                    if (!this.eventHandlers.get(trigger)) {
                        continue;
                    }
                    this.eventHandlers.set(trigger, this.eventHandlers.get(trigger)!.filter((value) => value.call.name != handler.name));
                    logger.debug(`Listener ${listener.constructor.name} unregistered for ${trigger.name}`);
                }
            }
        }
        logger.debug(`Listener ${listener.constructor.name} unregistered`);
    }

    /**
     * 注册事件
     * @param event 事件类型
     * @param handler 事件处理程序
     * @param priority 事件优先级
     */
    public registerEvent<T extends Event>(
        event: new (...args: any) => T,
        handler: (event: T) => void | Promise<void>,
        priority: EventPriority = EventPriority.NORMAL
    ) {
        if (!this.eventHandlers.get(event)) {
            this.eventHandlers.set(event, []);
        }
        const handlers = this.eventHandlers.get(event)!;
        handlers.push({ priority: priority, call: handler as <T extends Event>(event: T) => void | Promise<void> });
        handlers.sort((a, b) => b.priority - a.priority);
        this.eventHandlers.set(event, handlers);
        logger.debug(`Event ${event.name} registered`);
    }

}