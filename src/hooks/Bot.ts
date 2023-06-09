import path from "path";
import { Group } from "../entities/group/Group";
import { Friend, FriendStruct } from "../entities/sender/Friend";
import { Logger } from "../entities/system/Logger";
import { EventManager } from "../events/EventManager";
import { WebSocketStartedEvent } from "../events/websocket/WebSocketStartedEvent";
import { BotInitializedEvent } from "../events/bot/BotInitializedEvent";
import { WebSocketMessageEvent } from "../events/websocket/WebSocketMessageEvent";
import { WebSocket } from "../entities/system/WebSocket";
import { SenderStruct } from "../entities/sender/Sender";
import { MessageChain, MessageChainStruct } from "../entities/message/MessageChain";
import { GroupMember, GroupMemberStruct } from "../entities/group/GroupMember";
import { AnonymousSender } from "../entities/sender/AnonymousSender";
import { GroupMemberPermission } from "../entities/group/GroupMemberPermission";
import { GroupMessageEvent } from "../events/group/GroupMessageEvent";
import { WebSocketClosedEvent } from "../events/websocket/WebSocketClosedEvent";
import { BotDisconnectedEvent } from "../events/bot/BotDisconnectedEvent";
import { GroupStruct } from "../entities/group/Group";
import { Stranger, StrangerStruct } from "../entities/sender/Stranger";
import { Device } from "../entities/system/Device";
import { GroupFile, GroupFileStruct } from "../entities/group/GroupFile";
import { OfflineFile, OfflineFileStruct } from "../entities/misc/OfflineFile";
import { GroupFileUploadEvent } from "../events/group/GroupFileUploadEvent";
import { GroupAdminChangedEvent } from "../events/group/GroupAdminChangedEvent";
import { GroupMemberLeftEvent } from "../events/group/GroupMemberLeftEvent";
import { GroupSelfLeftEvent } from "../events/group/GroupSelfLeftEvent";
import { GroupSelfKickedEvent } from "../events/group/GroupSelfKickedEvent";
import { GroupMemberKickedEvent } from "../events/group/GroupMemberKickedEvent";
import { GroupSelfJoinedEvent } from "../events/group/GroupSelfJoinedEvent";
import { GroupMemberJoinedEvent } from "../events/group/GroupMemberJoinedEvent";
import { GroupWholeMutedEvent } from "../events/group/GroupWholeMutedEvent";
import { GroupWholeUnmutedEvent } from "../events/group/GroupWholeUnmutedEvent";
import { GroupMemberMutedEvent } from "../events/group/GroupMemberMutedEvent";
import { GroupMemberUnmutedEvent } from "../events/group/GroupMemberUnmutedEvent";
import { GroupMessageRecalledEvent } from "../events/group/GroupMessageRecalledEvent";
import { FriendAddedEvent } from "../events/friend/FriendAddedEvent";
import { FriendMessageRecalledEvent } from "../events/friend/FriendMessageRecalledEvent";
import { GroupPokeEvent } from "../events/group/GroupPokeEvent";
import { FriendPokeEvent } from "../events/friend/FriendPokeEvent";
import { GroupMemberLuckyKingEvent } from "../events/group/GroupMemberLuckyKingEvent";
import { HonorTypeStruct } from "../entities/misc/HonorType";
import { GroupMemberHonorChangedEvent } from "../events/group/GroupMemberHonorChangedEvent";
import { GroupMemberTitleChangedEvent } from "../events/group/GroupMemberTitleChangedEvent";
import { GroupMemberCardChangedEvent } from "../events/group/GroupMemberCardChangedEvent";
import { OfflineFileReceivedEvent } from "../events/misc/OfflineFileReceivedEvent";
import { GroupEssenceMessageChangedEvent } from "../events/group/GroupEssenceMessageChangedEvent";
import { FriendAddRequestEvent } from "../events/request/FriendAddRequestEvent";
import { GroupInviteRequestEvent } from "../events/request/GroupInviteRequestEvent";
import { GroupJoinRequestEvent } from "../events/request/GroupJoinRequestEvent";
import { WebSocketLifecycleEvent } from "../events/websocket/WebSocketLifeCycleEvent";
import { WebSocketHeartBeatEvent } from "../events/websocket/WebSocketHeartBeatEvent";
import { FriendMessageEvent } from "../events/friend/FriendMessageEvent";
import { StrangerMessageEvent } from "../events/misc/StrangerMessageEvent";


/**
 * @note 0      同时 ReturnStatus 为 ok，表示操作成功
 * @note 1      同时 ReturnStatus 为 async，表示操作已进入异步执行，具体结果未知
 * @note 100    参数缺失或参数无效，通常是因为没有传入必要参数，某些接口中也可能因为参数明显无效（比如传入的 QQ 号小于等于 0，此时无需调用 酷Q 函数即可确定失败），此项和以下的 ReturnStatus 均为 failed
 * @note 102    酷Q 函数返回的数据无效，一般是因为传入参数有效但没有权限，比如试图获取没有加入的群组的成员列表
 * @note 103    操作失败，一般是因为用户权限不足，或文件系统异常、不符合预期
 * @note 104    由于 酷Q 提供的凭证（Cookie 和 CSRF Token）失效导致请求 QQ 相关接口失败，可尝试清除 酷Q 缓存来解决
 * @note 201    工作线程池未正确初始化（无法执行异步任务）
 */
export type ReturnCode = number;

/**
 * @note ok     表示操作成功，同时 ReturnCode 等于 0，即 酷Q 函数返回了 0。
 * @note async  表示请求已提交异步处理，此时 ReturnCode 为 1，具体成功或失败将无法获知。
 * @note failed 表示操作失败，此时 ReturnCode 有两种情况：当大于 0 时，表示是 CQHTTP 插件判断出的失败；小于 0 时，为调用 酷Q 函数的返回码，具体含义直接参考 酷Q 文档的 错误代码 和 酷Q 日志。
 */
export type ReturnStatus = "ok" | "failed" | "async";

export type ReturnData = {
    status: ReturnStatus,
    retcode: ReturnCode,
    post_type?: string,
    msg?: string,
    wording?: string,
    message?: string,
    echo?: string,
    data?: any | null
}

export type Params = { [key: string]: any };


/**
 * 机器人
 */
export class Bot {

    private id: number | undefined;
    private nickname: string | undefined;

    private logger: Logger;

    private closing = false;
    private initialized = false;

    private friends = new Array<Friend>();
    private groups = new Array<Group>();
    private process = new Map<string, (data: ReturnData) => void>();

    constructor(
        private name: string,
        private eventManager: EventManager,
        private webSocket: WebSocket,
        private options: Params = {}
    ) {
        this.name = name;
        this.logger = new Logger(name, options["debug"] ? 5 : 4);
        // 初始化
        this.initialized = false;
        eventManager.registerEvent(WebSocketStartedEvent, async (_event: WebSocketStartedEvent) => {

            this.logger.info(`正在获取登陆号信息...`);
            await BotAPI.getLoginInfo(this).then((info) => {
                if (info == null) {
                    this.logger.fatal(`登陆号信息获取失败!`);
                    return;
                }
                this.id = info.user_id;
                this.nickname = info.nickname;
                this.logger.info(`登陆号信息获取完成: ${this.nickname} (${this.id})`);
            });

            this.logger.info(`正在获取好友列表...`);
            await BotAPI.getFriends(this).then((friends) => {
                if (friends == null) {
                    this.logger.fatal(`好友列表获取失败!`);
                    return;
                }
                this.friends = friends;
                this.logger.info(`好友列表获取完成: ${friends.length} 个好友`);
            });

            this.logger.info(`正在获取群聊列表...`);
            await BotAPI.getGroups(this).then((groups) => {
                if (groups == null) {
                    this.logger.fatal(`群聊列表获取失败!`);
                    return;
                }
                this.groups = groups;
                this.logger.info(`群聊列表获取完成: ${groups.length} 个群聊`);
            });

            if (this.id && this.nickname && this.friends.length > 0 && this.groups.length > 0) {
                this.logger.info(`基础信息初始化完成!`);
                //if (!this.options["ChannelSystem"] || !this.guildSystem!._Init()) { this.guildSystem = undefined; }
                this.initialized = true;
                eventManager.callEvent(new BotInitializedEvent(this));
            }
        });
        eventManager.registerEvent(WebSocketMessageEvent, (event: WebSocketMessageEvent) => {
            if (event.isBuffer()) { this.logger.warn("暂不支持Buffer信息!"); return; }
            // 解析数据
            let object = event.getObject();
            if (!object) {
                this.logger.warn("WebSocket信息解析失败!");
                return;
            }
            // 进程结束中
            if (this.closing) return;
            // 处理异步回调
            if (object.echo != null) {
                if (this.process.has(object.echo)) {
                    let callback = this.process.get(object.echo)!;
                    try {
                        callback(object);
                        this.process.delete(object.echo);
                    } catch (error) {
                        this.logger.error(`Error in RequestCallback:\n${(error as Error).stack}`);
                    }
                    return;
                }
            }
            // 处理事件
            switch (object.post_type as "message" | "notice" | "request" | "meta_event") {
                case "message": {
                    this._processOneBotMessage(object);
                    break;
                }
                case "notice": {
                    this._processOneBotNotice(object);
                    break;
                }
                case "request": {
                    this._processOneBotRequest(object);
                    break;
                }
                case "meta_event": {
                    this._processOneBotMetaEvent(object);
                    break;
                }
            }

        });
        eventManager.registerEvent(WebSocketClosedEvent, (_event: WebSocketClosedEvent) => {
            this.eventManager.callEvent(new BotDisconnectedEvent(this));
        });
        if (!!(options["log"]["file"] || "").trim()) {
            this.logger.setFile(path.join("./logs", options["log"]["file"]));
        }
    }

    private async _processOneBotMessage(object: {
        post_type: "message",
        message_type: "private" | "group" | "discuss" | "guild",
        sub_type: "friend" | "normal" | "anonymous" | "group" | "notice";
        message_id: number,
        raw_message: string,
        // TODO: 不知道为什么cq传的是string
        message: string,
        sender: SenderStruct
        group_id?: number,
        anonymous?: AnonymousSender,
    }) {
        switch (object.message_type as "private" | "group" | "guild") {
            case "private": {
                let sender: Friend | Stranger | null = await BotAPI.getFriend(this, object.sender.user_id!);
                if (!sender) sender = (await BotAPI.getStranger(this, object.sender.user_id!))!;
                let message = new MessageChain(this, object as MessageChainStruct);
                this.options["log"]["message"] && this.logger.info(
                    `私聊消息: ${sender.getNickname()} >> ${await BotAPI.autoReplaceCQCode(
                        this,
                        BotAPI.truncateString(message.getContent(), 100),
                        async (name, _d) => name)
                    }`
                );
                if (sender instanceof Friend) this.eventManager.callEvent(new FriendMessageEvent(this, sender, message));
                else this.eventManager.callEvent(new StrangerMessageEvent(this, sender, message));
                break;
            }
            case "group": {
                let group = (await BotAPI.getGroup(this, object.group_id!))!;
                let message = new MessageChain(this, object);
                let member: GroupMember | AnonymousSender;
                if (object.sub_type == "anonymous") {
                    member = object.anonymous!;
                } else {
                    member = (await BotAPI.getGroupMember(this, group.getId(), object.sender.user_id))!;
                }
                this.options["log"]["message"] &&
                    this.logger.info(`[${group.getName()}(${group.getId()})] ${member instanceof GroupMember ?
                            member.getCard() || member.getNickname() : object.anonymous?.getName() || "匿名用户"
                        } >> ${BotAPI.truncateString(
                            await BotAPI.autoReplaceCQCode(this, message.getContent(), async (name, data) => {
                                switch (name.toLowerCase()) {
                                    case "reply": name = "回复"; break;
                                    case "image": name = "图片"; break;
                                    case "at": {
                                        let user = (await group.getMember(+data["qq"]));
                                        if (user) name = "@" + user.getCard();
                                        else name = "@" + data["qq"];
                                        break;
                                    }
                                }
                                return `§e${name}`;
                            }), 100
                        )}`);
                this.eventManager.callEvent(new GroupMessageEvent(this, group, member, message));
                break;
            }
            // TODO: 未实现
            // case "discuss": {
            //     break;
            // }
            // case "guild": {
            //     ProcessOneBotGuildEvent.call(this, object);
            //     break;
            // }
        }

    }

    private async _processOneBotNotice(object: {
        post_type: "notice",
        notice_type:
        // 群文件上传
        "group_upload" |
        // 群管理变动
        "group_admin" |
        // 群成员减少
        "group_decrease" |
        // 群成员增加
        "group_increase" |
        // 群禁言
        "group_ban" |
        // 群消息撤回
        "group_recall" |
        // 群成员名片变动
        "group_card" |
        // 群精华消息变动
        "essence" |
        // 好友添加请求
        "friend_add" |
        "friend_recall" |
        "offline_file" |
        // 其他客户端在线状态变更
        "client_status" |
        "notify" |
        // 频道事件
        "message_reactions_updated" |
        "channel_updated" |
        "channel_created" |
        "channel_destroyed",
        sub_type:
        // group_increase
        "approve" |
        "invite" |
        // group_decrease
        "leave" |
        "kick" |
        "kick_me" |
        // group_admin
        "set" |
        "unset" |
        // group_ban
        "ban" |
        "lift_ban" |
        // notify
        "poke" |
        "lucky_king" |
        "honor" |
        "title" |
        // essence
        "add" |
        "delete",
        group_id?: number,
        user_id?: number,
        operator_id?: number,
        message_id?: number,
        file?: GroupFileStruct | OfflineFileStruct,
        honor_type?: HonorTypeStruct,
        // group_ban
        duration?: number,
        // notify.title
        title?: string,
        // notify.poke
        target_id?: number,
        // group_card
        card_new?: string,
        card_old?: string,
        // client_status
        client?: Device,
        online?: boolean,
    }) {
        switch (object.notice_type) {
            case "group_upload": {
                let group = (await BotAPI.getGroup(this, object.group_id!))!;
                let member = (await group.getMember(object.user_id!))!;
                let file = new GroupFile(this, object.file! as GroupFileStruct);
                this.eventManager.callEvent(new GroupFileUploadEvent(this, group, member, file));
                break;
            }
            case "group_admin": {
                let group = (await BotAPI.getGroup(this, object.group_id!))!;
                let member = (await group.getMember(object.user_id!))!;
                this.eventManager.callEvent(new GroupAdminChangedEvent(this, group, member, object.sub_type));
                let perms = ["Admin", "Member"];
                await member.refresh();
                this.options["log"]["notice"] && this.logger.info(`[${group.getName()} (${group.getId()})]群管理员变动: ${member.getCard() || member.getNickname()} (${member.getId()}) (${perms[+(object.sub_type == "set")]}) -> (${perms[+(object.sub_type == "unset")]})`);
                break;
            }
            case "group_decrease": {
                let group = (await BotAPI.getGroup(this, object.group_id!))!;
                let member = (await group.getMember(object.user_id!))!;
                let operator = (await group.getMember(object.operator_id!))!;
                this.eventManager.callEvent(new GroupMemberLeftEvent(this, group, member));
                // 群主离开群聊
                // 不知道为什么实测这个也不会触发
                // 好像是解散群聊时会先强制机器号leave退出群聊，而不是被踢出
                // if (group.getOwner().getId() == object.user_id) {
                //     this.eventManager.callEvent(new GroupDismissedEvent(this, group));
                //     this.groups.splice(this.groups.findIndex((g) => g.getId() == group.getId()), 1);
                //     this.options["NoticeLog"] && this.logger.info(`群聊: [${group.getName()}](${group.getId()}) 已解散`);
                // }

                // 机器人离开群聊
                if (object.user_id == this.id) {
                    this.eventManager.callEvent(await GroupSelfLeftEvent.create(this, group));
                    let str = "离开";
                    if (object.sub_type == "kick_me") {
                        str = "被踢出";
                        this.eventManager.callEvent(await GroupSelfKickedEvent.create(this, group, operator));
                    }
                    this.groups.splice(this.groups.findIndex((g) => g.getId() == group.getId()), 1);
                    this.options["log"]["notice"] && this.logger.info(`登录号${str} 群聊: ${group.getName()} (${group.getId()})`);
                }
                // 成员离开群聊
                else if (object.sub_type == "leave" || object.sub_type == "kick") {
                    this.eventManager.callEvent(new GroupMemberLeftEvent(this, group, member));
                    let str = "退出";
                    if (object.sub_type == "kick") {
                        str = "被踢出";
                        this.eventManager.callEvent(new GroupMemberKickedEvent(this, group, member, operator));
                    }
                    group.deleteMember(member.getId());
                    this.options["log"]["notice"] && this.logger.info(`[${group.getName()} (${group.getId()})] 成员 ${member.getCard() || member.getNickname} (${member.getId()}) ${str}群聊`);
                }
                break;
            }
            case "group_increase": {
                let group = (await BotAPI.getGroup(this, object.group_id!))!;
                let member = (await group.getMember(object.user_id!))!;
                this.eventManager.callEvent(new GroupMemberJoinedEvent(this, group, member));
                if (object.user_id == this.id) {
                    this.groups.push(group);
                    this.eventManager.callEvent(await GroupSelfJoinedEvent.create(this, group));
                    this.options["log"]["notice"] && this.logger.info(`登录号加入群聊: ${group.getName()} (${group.getId()}) !`);
                } else {
                    this.options["log"]["notice"] && this.logger.info(`[${group.getName()} (${group.getId()})]加入新成员: ${member.getNickname()} (${member.getId()})`);
                }
                break;
            }
            case "group_ban": {
                let group = (await BotAPI.getGroup(this, object.group_id!))!;
                let operator = (await group.getMember(object.operator_id!))!;
                if (object.user_id == 0) {
                    if (object.sub_type == "ban") this.eventManager.callEvent(new GroupWholeMutedEvent(this, group, operator));
                    else this.eventManager.callEvent(new GroupWholeUnmutedEvent(this, group, operator));
                } else {
                    let member = (await group.getMember(object.user_id!))!;
                    if (object.sub_type == "ban") this.eventManager.callEvent(
                        new GroupMemberMutedEvent(this, group, member, operator, object.duration!)
                    );
                    else this.eventManager.callEvent(
                        new GroupMemberUnmutedEvent(this, group, member, operator)
                    );
                }
                break;
            }
            case "group_recall": {
                let group = (await BotAPI.getGroup(this, object.group_id!))!;
                let member = (await group.getMember(object.user_id!))!;
                let operator = (await group.getMember(object.operator_id!))!;
                let message = await BotAPI.getMessage(this, object.message_id!);
                if (!message) return;
                this.eventManager.callEvent(new GroupMessageRecalledEvent(this, group, member, operator, message));
                break;
            }
            case "friend_add": {
                let friend = (await BotAPI.getFriend(this, object.user_id!))!;
                this.friends.push(friend);
                this.eventManager.callEvent(new FriendAddedEvent(this, friend));
                break;
            }
            case "friend_recall": {
                let friend = (await BotAPI.getFriend(this, object.user_id!))!;
                let message = await BotAPI.getMessage(this, object.message_id!);
                if (!message) return;
                this.eventManager.callEvent(new FriendMessageRecalledEvent(this, friend, message));
                break;
            }
            case "notify": {
                if (object.sub_type == "poke") {
                    if (object.group_id) {
                        let group = (await BotAPI.getGroup(this, object.group_id))!;
                        let sender = (await group.getMember(object.user_id!))!;
                        let target = (await group.getMember(object.target_id!))!;
                        this.eventManager.callEvent(new GroupPokeEvent(this, group, sender, target));
                    } else {
                        let friend = (await BotAPI.getFriend(this, object.user_id!))!;
                        this.eventManager.callEvent(new FriendPokeEvent(this, friend));
                    }
                } else switch (object.sub_type as "lucky_king" | "honor" | "title") {
                    case "lucky_king": {
                        let group = (await BotAPI.getGroup(this, object.group_id!))!;
                        let sender = (await group.getMember(object.user_id!))!;
                        let target = (await group.getMember(object.target_id!))!;
                        this.eventManager.callEvent(new GroupMemberLuckyKingEvent(this, group, sender, target));
                        break;
                    }
                    case "honor": {
                        let group = (await BotAPI.getGroup(this, object.group_id!))!;
                        let member = (await group.getMember(object.user_id!))!;
                        this.eventManager.callEvent(new GroupMemberHonorChangedEvent(this, group, member, object.honor_type!));
                        break;
                    }
                    case "title": {
                        let group = (await BotAPI.getGroup(this, object.group_id!))!;
                        let member = (await group.getMember(object.user_id!))!;
                        this.eventManager.callEvent(new GroupMemberTitleChangedEvent(this, group, member, object.title!));
                        break;
                    }
                }
                break;
            }
            case "group_card": {
                let group = (await BotAPI.getGroup(this, object.group_id!))!;
                let member = (await group.getMember(object.user_id!))!;
                this.eventManager.callEvent(new GroupMemberCardChangedEvent(this, group, member, object.card_new!, object.card_old!));
                break;
            }
            case "offline_file": {
                let stranger = (await BotAPI.getStranger(this, object.user_id!))!;
                let file = new OfflineFile(this, object.file! as OfflineFileStruct);
                this.eventManager.callEvent(new OfflineFileReceivedEvent(this, stranger, file));
                break;
            }
            // TODO: 实测CQHTTP不会发送此事件 待修复
            // case "client_status": {
            //     let device = new DeviceInfo(object.client);
            //     this.events.onClientStatusChanged.fire(
            //         "OneBotDockingProcess_Event_ClientStatusChanged",
            //         object.time * 1000,
            //         device,
            //         object.online
            //     );
            //     break;
            // }
            case "essence": {
                let group = await BotAPI.getGroup(this, object.group_id!);
                if (!group) return;
                let sender = (await group.getMember(object.user_id!))!;
                let operator = (await group.getMember(object.operator_id!))!;
                let message = await BotAPI.getMessage(this, object.message_id!);
                if (!message) return;
                this.eventManager.callEvent(new GroupEssenceMessageChangedEvent(this, group, sender, operator, message, object.sub_type!));
                break;
            }
            // /** 频道 */
            // case "channel_created":
            // case "channel_destroyed":
            // case "channel_updated":
            // case "message_reactions_updated": {
            //     ProcessOneBotGuildEvent.call(this, object);
            //     break;
            // }
        }
    }

    private async _processOneBotRequest(object: {
        post_type: "request",
        request_type: "friend" | "group",
        sub_type: "add" | "invite",
        user_id: number,
        group_id?: number,
        comment: string,
        flag: string,
    }) {
        switch (object.request_type) {
            case "friend": {
                let stranger = (await BotAPI.getStranger(this, object.user_id))!;
                this.eventManager.callEvent(new FriendAddRequestEvent(this, stranger, object.comment, object.flag));
                break;
            }
            case "group": {
                let group = (await BotAPI.getGroup(this, object.group_id!))!;
                let stranger = (await BotAPI.getStranger(this, object.user_id))!;
                switch (object.sub_type) {
                    case "add": {
                        this.eventManager.callEvent(new GroupJoinRequestEvent(this, group, stranger, object.comment, object.flag));
                        break;
                    }
                    case "invite": {
                        this.eventManager.callEvent(new GroupInviteRequestEvent(this, group, stranger, object.comment, object.flag));
                        break;
                    }
                }
                break;
            }
        }

    }

    private async _processOneBotMetaEvent(object: {
        post_type: "meta_event",
        meta_event_type: "lifecycle" | "heartbeat",
        sub_type?: "enable" | "disable" | "connect",
        interval?: number,
    }) {
        switch (object.meta_event_type) {
            case "lifecycle": {
                this.eventManager.callEvent(new WebSocketLifecycleEvent(this.getWebSocket(), object.sub_type!));
                break;
            }
            case "heartbeat": {
                this.eventManager.callEvent(new WebSocketHeartBeatEvent(this.getWebSocket(), object.interval!));
                break;
            }
        }
    }

    public getProcess() { return this.process; }
    public setProcess(id: string, fun: (data: ReturnData) => void) { this.process.set(id, fun); }

    public getId() { return this.id; }
    public getName() { return this.name; }
    public getLogger() { return this.logger; }
    public getEventManager() { return this.eventManager; }
    public getWebSocket() { return this.webSocket; }
    public isClosing() { return this.closing; }
    public isInitialized() { return this.initialized; }

    public getFriends() { return this.friends; }
    public getGroups() { return this.groups; }

}

export class BotAPI {

    private static logger = new Logger("BotAPI");

    private static async _sendRequest(bot: Bot, type: string, params: Params, fun: (data: Params) => void) {
        let fun0 = fun;
        let id = Math.random().toString(16).slice(2);
        let content = JSON.stringify({
            "action": type,
            "params": params,
            "echo": id
        });
        let err = new Error("Error Stack");
        fun = (object) => {
            if (object.msg) {
                BotAPI.logger.error(`API [${type}] 调用错误回执: ${object.msg}(${object.wording})`);
                if (object.msg != "API_ERROR") {
                    this.logger.errorPrint(
                        // name
                        `Use_OneBot_Websocket_API: ${type}`,
                        // msg
                        `${object.msg}(${object.wording!})`,
                        // data
                        `发送数据:\n\`\`\`json${content}\n\`\`\`\n\n调用堆栈:\n\`\`\`txt\n${err.stack}\n\`\`\``
                    );
                } else {
                    this.logger.warn(`API异常! 请检查 OneBot 状况!`);
                }
            }
            fun0(object);
        };
        if (bot.isClosing() || bot.getWebSocket().getClient().readyState != bot.getWebSocket().getClient().OPEN) {
            let info = "Websocket连接未建立! 无法发起请求!";
            fun({
                status: "failed",
                retcode: -1,
                wording: info,
                msg: "API_ERROR",
                message: info
            });
            return;
        }
        bot.setProcess(id, fun);
        bot.getWebSocket().send(content);
    }

    private static _sendRequestProcess<T>(bot: Bot, type: string, params: Params = {}) {
        return new Promise<T | null>((outputData, _outputError) => {
            BotAPI._sendRequest(bot, type, params, (res) => outputData(res.data));
        });
    }

    /**
     * 异步获取登录号信息
     * @async 异步操作
     * @param bot 机器人
     * @returns 登陆号信息
     */
    public static getLoginInfo(bot: Bot) {
        return this._sendRequestProcess<{
            user_id: number,
            nickname: string
        }>(bot, "get_login_info");
    }

    /**
     * 异步获取陌生人结构
     * @async 异步操作
     * @param bot 机器人
     * @param userId 陌生人QQ号
     * @returns 陌生人结构
     */
    public static getStrangerStruct(bot: Bot, userId: number) {
        return this._sendRequestProcess<StrangerStruct>(bot, "get_stranger_info", {
            user_id: userId
        });
    }

    /**
     * 异步获取陌生人对象
     * @async 异步操作
     * @param bot 机器人
     * @param userId 陌生人QQ号
     * @returns 陌生人对象
     */
    public static async getStranger(bot: Bot, userId: number) {
        let data = await this.getStrangerStruct(bot, userId);
        if (data != null) {
            return new Stranger(bot, data);
        } else return null;
    }

    /**
     * 异步获取好友结构
     * @async 异步操作
     * @param bot 机器人
     * @param userId 好友QQ号
     * @returns 好友结构
     */
    public static getFriendStruct(bot: Bot, userId: number) {
        return this._sendRequestProcess<FriendStruct>(bot, "get_friend_info", {
            user_id: userId
        });
    }

    /**
     * 异步获取好友对象
     * @async 异步操作
     * @param bot 机器人
     * @param userId 好友QQ号
     * @returns 好友对象
     */
    public static async getFriend(bot: Bot, userId: number) {
        let friend = await this.getFriendStruct(bot, userId);
        if (friend != null) {
            return new Friend(bot, friend);
        } else return null;
    }

    /**
     * 异步获取好友结构列表
     * @async 异步操作
     * @param bot 机器人
     * @returns 好友结构列表
     */
    public static getFriendStructs(bot: Bot) {
        return this._sendRequestProcess<Array<FriendStruct>>(bot, "get_friend_list");
    }

    /**
     * 异步获取好友列表
     * @async 异步操作
     * @param bot 机器人
     * @returns 好友列表
     */
    public static async getFriends(bot: Bot) {
        let data = await this.getFriendStructs(bot);
        if (data) {
            let friends = new Array<Friend>();
            data.forEach((friendData) => friends.push(
                new Friend(bot, friendData)
            ));
            return friends;
        } else return null;
    }

    /**
     * 异步获取群聊结构
     * @async 异步操作
     * @param bot 机器人
     * @param groupId 群聊号
     * @returns 群聊结构
     */
    public static getGroupStruct(bot: Bot, groupId: number) {
        return this._sendRequestProcess<GroupStruct>(bot, "get_group_info", {
            group_id: groupId
        });
    }

    /**
     * 异步获取群聊对象
     * @param bot 机器人
     * @param groupId 群聊号
     * @returns 群聊对象
     */
    public static async getGroup(bot: Bot, groupId: number) {
        let data = await this.getGroupStruct(bot, groupId);
        if (data != null) {
            return new Group(bot, data);
        } else return null;
    }

    /**
     * 异步获取群聊结构列表
     * @param bot 机器人
     * @returns 群聊结构列表
     */
    public static getGroupStructs(bot: Bot) {
        return this._sendRequestProcess<Array<GroupStruct>>(bot, "get_group_list");
    }

    /**
     * 异步获取群聊列表
     * @async 异步操作
     * @param bot 机器人
     * @returns 群聊列表
     */
    public static async getGroups(bot: Bot) {
        let data = await this.getGroupStructs(bot);
        if (data != null) {
            let groups = new Array<Group>();
            data.forEach((groupData) => groups.push(
                new Group(bot, groupData)
            ));
            return groups;
        } else return null;
    }

    /**
     * 异步获取群聊成员结构
     * @async 异步操作
     * @param bot 机器人
     * @param groupId 群聊号
     * @param userId 成员QQ号
     * @returns 群聊成员结构
     */
    public static getGroupMemberStruct(bot: Bot, groupId: number, userId: number) {
        return this._sendRequestProcess<GroupMemberStruct>(bot, "get_group_member_info", {
            group_id: groupId,
            user_id: userId
        });
    }

    /**
     * 异步获取群聊成员对象
     * @async 异步操作
     * @param bot 机器人
     * @param groupId 群聊号
     * @param userId 成员QQ号
     * @returns 群聊成员对象
     */
    public static async getGroupMember(bot: Bot, groupId: number, userId: number) {
        let data = await this.getGroupMemberStruct(bot, groupId, userId);
        if (data != null) {
            return await GroupMember.create(bot, data);
        } else return null;
    }

    /**
     * 异步获取群聊成员结构列表
     * @async 异步操作
     * @param bot 机器人
     * @param groupId 群聊号
     * @returns 群聊成员结构列表
     */
    public static getGroupMemberStructs(bot: Bot, groupId: number) {
        return this._sendRequestProcess<Array<GroupMemberStruct>>(bot, "get_group_member_list", {
            group_id: groupId,
        });
    }

    /**
     * 异步获取群聊成员对象列表
     * @async 异步操作
     * @param bot 机器人
     * @param groupId 群聊号
     * @returns 群聊成员对象列表
     */
    public static async getGroupMembers(bot: Bot, groupId: number) {
        let data = await this.getGroupMemberStructs(bot, groupId);
        if (data != null) {
            let members = new Array<GroupMember>();
            for (let memberData of data) {
                members.push(await GroupMember.create(bot, memberData));
            }
            return members;
        } else return null;
    }

    /**
     * 异步获取消息结构
     * @async 异步操作
     * @param bot 机器人
     * @param messageId 消息ID
     * @returns 消息结构
     */
    public static getMessageStruct(bot: Bot, messageId: number) {
        return this._sendRequestProcess<MessageChainStruct>(bot, "get_msg", {
            message_id: messageId
        });
    }

    /**
     * 异步获取消息对象
     * @async 异步操作
     * @param bot 机器人
     * @param messageId 消息ID
     * @returns 消息对象
     */
    public static async getMessage(bot: Bot, messageId: number) {
        let data = await this.getMessageStruct(bot, messageId);
        if (data != null) {
            return new MessageChain(bot, data);
        } else return null;
    }

    /**
     * 截取字符串
     * @param string 原始文本
     * @param size 截取长度
     * @returns 截取后的文本
     */
    public static truncateString(string: string, size: number) {
        if (string.length > size) string = string.substring(0, size) + "…";
        return string;
    }

    /**
     * 自动替换CQ码
     * @param string 
     * @param _this 
     * @param fun 
     * @returns 
     */
    public static async autoReplaceCQCode(bot: Bot, string: string, fun: (name: string, data: Params) => Promise<string>) {
        let CQCodeIndex = string.indexOf("[CQ:");
        while (CQCodeIndex != -1) {
            let CCLIndex = CQCodeIndex + 4;
            let name = "", _End = false;
            while (string[CCLIndex] != "]" && string[CCLIndex] != undefined) {
                if (string[CCLIndex] == ",") { _End = true; }
                if (!_End) {
                    name += string[CCLIndex];
                }
                CCLIndex += 1;
            }
            CCLIndex += 1;
            let str = string.substring(CQCodeIndex, CCLIndex).replace(/[ ]/g, "");
            let data = str.substring((4 + name.length), (str.length - 1));
            if (!!data) { data = data.substring(1); }
            name = name[0].toUpperCase() + name.substring(1);
            string = string.substring(0, CQCodeIndex) + `§6[${await fun(name, BotAPI.objectifyCQCode(data))}§6]§r` + string.substring(CCLIndex);
            CQCodeIndex = string.indexOf("[CQ:");
        }
        return string;
    }

    /**
     * 对象化CQ码
     * @param string 待处理字符串
     * @returns CQ码对象
     */
    public static objectifyCQCode(string: string) {
        let object: Params = {};
        let params = string.split(",");
        params.forEach((kv) => {
            let arr = kv.split("=");
            object[arr[0]] = arr[1];
        });
        return object;
    }

}