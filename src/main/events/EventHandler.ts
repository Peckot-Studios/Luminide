/**
 * 事件处理器 抽象类
 * @abstract
 * @author Pectics
 */
export abstract class EventHandler {
    abstract onWebSocketDestroyed(): void; // 当 WebSocket 被销毁
    abstract onWebSocketDisconnected(): void; // 当 WebSocket 连接断开
    abstract onWebSocketHeartBeat(): void; // 当 WebSocket 接收到心跳
    abstract onWebSocketMessage(): void; // 当 WebSocket 接收到信息
    abstract onWebSocketStatusChanged(): void; // 当 WebSocket 状态改变

    abstract onBotInitialized(): void; // 当 Bot 初始化完成
    abstract onBotLifeCycle(): void; // 当 Bot 经历生命周期

    abstract onGroupMemberBecomesLuckKing(): void; // 当 GroupMember 成为拼手气红包运气王
    abstract onGroupMemberFile(): void; // 当 GroupMember 上传文件
    abstract onGroupMemberHonorChanged(): void; // 当 GroupMember 头衔变更
    abstract onGroupMemberJoined(): void; // 当 GroupMember 加入
    abstract onGroupMemberKicked(): void; // 当 GroupMember 被踢出
    abstract onGroupMemberLeft(): void; // 当 GroupMember 离开
    abstract onGroupMemberMessage(): void; // 当 GroupMember 发送消息
    abstract onGroupMemberMessageRecalled(): void; // 当 GroupMember 的消息被撤回
    abstract onGroupMemberMuted(): void; // 当 GroupMember 被禁言
    abstract onGroupMemberNameCardChanged(): void; // 当 GroupMember 群名片变更
    abstract onGroupMemberPermissionChanged(): void; // 当 GroupMember 权限变更
    abstract onGroupMemberPoke(): void; // 当 GroupMember 发送戳一戳
    abstract onGroupMemberUnmuted(): void; // 当 GroupMember 被解除禁言

    abstract onGroupDismissed(): void; // 当 Group 被解散
    abstract onGroupEssenceMessageChanged(): void; // 当 Group 精华消息变更
    abstract onGroupRequest(): void; // 当 Group 收到加群请求

    abstract onPrivateMessage(): void; // 当收到私聊消息
}
