import path from "path";
import { Group } from "../entities/group/Group";
import { Friend } from "../entities/sender/Friend";
import { Logger } from "../entities/system/Logger";
import { EventManager } from "../events/EventManager";
import { Listener } from "../events/Listener";
import { WebSocketStartedEvent } from "../events/websocket/WebSocketStartedEvent";
import { Event } from "../events/Event";
import { BotInitializedEvent } from "../events/bot/BotInitializedEvent";
import { WebSocketMessageEvent } from "../events/websocket/WebSocketMessageEvent";
import { WebSocket } from "../entities/system/WebSocket";
import { Sender } from "../entities/sender/Sender";
import { Message } from "../entities/message/Message";
import { MessageChain } from "../entities/message/MessageChain";
import { PrivateMessageEvent } from "../events/message/PrivateMessageEvent";
import { GroupMember } from "../entities/group/GroupMember";
import { AnonymousSender } from "../entities/sender/AnonymousSender";
import { GroupMemberPermission } from "../entities/group/GroupMemberPermission";
import { promisify } from "util";
import { GroupMessageEvent } from "../events/message/GroupMessageEvent";
import { WebSocketClosedEvent } from "../events/websocket/WebSocketClosedEvent";
import { BotDisconnectedEvent } from "../events/bot/BotDisconnectedEvent";


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

    private name: string;
    private logger: Logger;
    private eventManager: EventManager;
    private webSocket: WebSocket;

    private closing = false;
    private initialized = false;

    private friends = new Array<Friend>();
    private groups = new Array<Group>();
    private process = new Map<string, (data: ReturnData) => void>();
    private options: Params = {};

    constructor(
        name: string,
        eventManager: EventManager,
        webSocket: WebSocket,
        options: Params = {}
    ) {
        this.name = name;
        this.logger = new Logger(name, options["Debug"] ? 5 : 4);
        this.eventManager = eventManager;
        this.webSocket = webSocket;
        this.options = options;
        // 初始化
        this.initialized = false;
        eventManager.registerEvent(WebSocketStartedEvent, async (_event: Event) => {

            this.logger.info(`正在获取登陆号信息...`);
            await BotAPI.getLoginInfo(this).then((info) => {
                if (info == null) {
                    this.logger.fatal(`登陆号信息获取失败!`);
                    return;
                }
                this.id = info.id;
                this.nickname = info.nickname;
                this.logger.info(`登陆号信息获取完成: ${this.nickname} (${this.id})`);
            });

            this.logger.info(`正在获取好友列表...`);
            BotAPI.getFriends(this).then((friends) => {
                if (friends == null) {
                    this.logger.fatal(`好友列表获取失败!`);
                    return;
                }
                this.friends = friends;
                this.logger.info(`好友列表获取完成: ${friends.length} 个好友`);
            });

            this.logger.info(`正在获取群聊列表...`);
            BotAPI.getGroups(this).then((groups) => {
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
                let callback: ((data: ReturnData) => void) | undefined;
                if ((callback = this.process.get(object.echo))) {
                    try {
                        callback(object as any);
                        this.process.delete(object.echo);
                    } catch (error) {
                        this.logger.error(`Error in RequestCallback:\n${(error as Error).stack}`);
                    }
                }
                return;
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
        eventManager.registerEvent(WebSocketClosedEvent, (_event: Event) => {
            this.eventManager.callEvent(new BotDisconnectedEvent(this));
        });
        if (!!(options["LogFile"] || "").trim()) {
            this.logger.setFile(path.join("./logs", options["LogFile"]));
        }
    }

    private async _processOneBotMessage(object: {
        message_type: "private" | "group" | "discuss" | "guild",
        sub_type: "friend" | "normal" | "anonymous" | "group" | "notice";
        message_id: number,
        message: Array<Message>,
        raw_message: string,
        group_id?: number,
        anonymous?: AnonymousSender,
        sender: {
            user_id: number,
            nickname: string,
            sex: "male" | "female" | "unknown",
            age: number,
            card?: string,
            area?: string,
            level?: number,
            role?: "owner" | "admin" | "member",
            title?: string
        }
    }) {
        switch (object.message_type as "private" | "group" | "guild") {
            case "private": {
                let sender = new Sender(
                    object.sender.user_id,
                    object.sender.nickname,
                    object.sender.sex,
                    object.sender.age
                );
                let messageChain = new MessageChain(
                    object.message_id,
                    object.message,
                    object.raw_message
                );

                this.options["MessageLog"] && this.logger.info(
                    `私聊消息: ${sender.getNickname()} >> ${await BotAPI.autoReplaceCQCode(
                        this,
                        BotAPI.truncateString(messageChain.getContent(), 100),
                        async (name, _d) => name)
                    }`
                );
                this.eventManager.callEvent(new PrivateMessageEvent(messageChain, sender));
                break;
            }
            case "group": {
                let messageChain = new MessageChain(
                    object.message_id,
                    object.message,
                    object.raw_message
                );
                let group = (await BotAPI.getGroup(this, object.group_id!))!;
                let member: GroupMember | AnonymousSender;

                if (object.sub_type == "anonymous") {
                    member = object.anonymous!;
                } else {
                    member = (await BotAPI.getGroupMember(this, group.getId(), object.sender.user_id))!;
                }
                this.options["MessageLog"] &&
                    this.logger.info(`[${group.getName()}(${group.getId()})] ${object.sender.nickname} >> ${BotAPI.truncateString(
                        await BotAPI.autoReplaceCQCode(this, messageChain.getContent(), async (name, data) => {
                            if (name.toLowerCase() == "at") {
                                let user = (await group.refresh()).getMember(+data["qq"]);
                                if (user == null) {
                                    name = "@" + data["qq"];
                                } else { name = "@" + user.getCard(); }
                            }
                            return `§e${name}§d`;
                        }), 100
                    )}`);
                this.eventManager.callEvent(new GroupMessageEvent(messageChain, group, member));
                break;
            }
            // case "discuss": {
            //     break;
            // }
            // case "guild": {
            //     ProcessOneBotGuildEvent.call(this, object);
            //     break;
            // }
        }

    }

    private async _processOneBotNotice(object: ReturnData) {

    }

    private async _processOneBotRequest(object: ReturnData) {

    }

    private async _processOneBotMetaEvent(object: ReturnData) {

    }

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

    private static _sendRequest(bot: Bot, type: string, params: Params, fun: (data: ReturnData) => void) {
        let fun0 = fun;
        let id = Math.random().toString(16).slice(2);
        let content = JSON.stringify({
            "action": type,
            "params": params,
            "echo": id
        });
        let err = new Error("Error Stack");
        fun = (obj) => {
            if (obj.msg != null) {
                BotAPI.logger.error(`API [${type}] 调用错误回执: ${obj.msg}(${obj.wording})`);
                if (obj.msg != "API_ERROR") {
                    this.logger.errorPrint(
                        // name
                        `Use_OneBot_Websocket_API: ${type}`,
                        // message
                        `${obj.msg}(${obj.wording!})`,
                        // data
                        `发送数据:\n\`\`\`json${content}\n\`\`\`\n\n调用堆栈:\n\`\`\`txt\n${err.stack}\n\`\`\``
                    );
                } else {
                    this.logger.warn(`API异常! 请检查 OneBot 状况!`);
                }
            }
            fun0(obj);
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
        bot.getWebSocket().send(content);
    }

    private static _sendRequestProcess(bot: Bot, type: string, params: Params = {}) {
        let process = new Promise<ReturnData>((outMessage, _outError) => {
            BotAPI._sendRequest(bot, type, params, (fun) => outMessage(fun));
        });
        return process;
    }

    /**
     * 获取登录号信息
     * @param bot 机器人
     * @returns 登陆号信息
     */
    public static async getLoginInfo(bot: Bot) {
        let data = (await this._sendRequestProcess(bot, "get_login_info")).data;
        if (data == null) {
            this.logger.error(`登录号信息获取失败!`);
            return null;
        }
        return {
            id: data.user_id,
            nickname: data.nickname
        };
    }

    /**
     * 同步获取登录号信息
     * @param bot 机器人
     * @returns 登陆号信息
     */
    public static getLoginInfoSync(bot: Bot) {
        let info: {
            id: number,
            nickname: string
        } | null | undefined;
        this.getLoginInfo(bot).then((data) => {
            info = data;
        });
        while (undefined === info) { }
        return info;
    }

    /**
     * 获取好友列表
     * @param bot 机器人
     * @returns 好友列表
     */
    public static async getFriends(bot: Bot) {
        let data = (await this._sendRequestProcess(bot, "get_friend_list", {})).data as ({
            user_id: number,
            nickname: string,
            remark: string
        }[]) | null;
        if (data != null) {
            let friends = new Array<Friend>();
            data.forEach((friendData) => friends.push(
                new Friend(
                    friendData.user_id,
                    friendData.nickname,
                    friendData.remark
                )
            ));
            return friends;
        } else return null;
    }

    /**
     * 同步获取好友列表
     * @param bot 机器人
     * @returns 好友列表
     */
    public static getFriendsSync(bot: Bot) {
        let friends: Array<Friend> | null = [];
        this.getFriends(bot).then((data) => {
            friends = data;
        });
        while (friends.length == 0) { }
        return friends;
    }

    /**
     * 获取实时好友对象数据
     * @param bot 机器人
     * @param userId 好友QQ号
     * @returns 好友对象
     */
    public static async getFriend(bot: Bot, userId: number) {
        let friends = await this.getFriends(bot);
        if (friends != null) {
            for (const friend of friends) {
                if (friend.getId() == userId) return friend;
            }
        }
        return null;
    }

    /**
     * 同步获取实时好友对象数据
     * @param bot 机器人
     * @param userId 好友QQ号
     * @returns 好友对象
     */
    public static getFriendSync(bot: Bot, userId: number) {
        let friend: Friend | null | undefined;
        this.getFriend(bot, userId).then((data) => {
            friend = data;
        });
        while (undefined === friend) { }
        return friend;
    }

    /**
     * 获取群聊列表
     * @param bot 机器人
     * @returns 群聊列表
     */
    public static async getGroups(bot: Bot) {
        let data = (await this._sendRequestProcess(bot, "get_group_list", {})).data as ({
            group_id: number,
            group_name: string,
            group_memo: string
        })[] | null;
        if (data != null) {
            let groups = new Array<Group>();
            data.forEach((groupData) => groups.push(
                new Group(
                    bot,
                    groupData.group_id,
                    groupData.group_name,
                    groupData.group_memo
                )
            ));
            return groups;
        } else return null;
    }

    /**
     * 同步获取群聊列表
     * @param bot 机器人
     * @returns 群聊列表
     */
    public static getGroupsSync(bot: Bot) {
        let groups: Array<Group> | null = [];
        this.getGroups(bot).then((data) => {
            groups = data;
        });
        while (groups.length == 0) { }
        return groups;
    }

    /**
     * 获取实时群聊对象数据
     * @param bot 机器人
     */
    public static async getGroup(bot: Bot, groupId: number) {
        let data = (await this._sendRequestProcess(bot, "get_group_info", { group_id: groupId })).data as ({
            group_id: number,
            group_name: string,
            group_memo: string
        }) | null;
        if (data != null) {
            return new Group(
                bot,
                data.group_id,
                data.group_name,
                data.group_memo
            );
        } else return null;
    }

    /**
     * 同步获取实时群聊对象数据
     * @param bot 机器人
     * @param groupId 群聊号
     * @returns 群聊对象
     */
    public static getGroupSync(bot: Bot, groupId: number) {
        let group: Group | null | undefined;
        this.getGroup(bot, groupId).then((data) => {
            group = data;
        });
        while (undefined === group) { }
        return group;
    }

    /**
     * 获取群聊实时成员列表
     * @param bot 机器人
     * @param groupId 群聊号
     * @returns 成员列表
     */
    public static async getGroupMembers(bot: Bot, groupId: number) {
        let data = (await this._sendRequestProcess(bot, "get_group_member_list", { group_id: groupId })).data as ({
            group_id: number,
            user_id: number,
            nickname: string,
            card: string,
            sex: "male" | "female" | "unknown",
            age: number,
            area: string,
            join_time: number,
            last_sent_time: number,
            level: number,
            role: "owner" | "admin" | "member",
            unfriendly: boolean,
            title: string,
            title_expire_time: number,
            card_changeable: boolean,
            shut_up_timestamp: number
        })[] | null;
        let members = new Array<GroupMember>();
        if (data != null) {
            data.forEach(async (memberData) => members.push(new GroupMember(
                (await this.getGroup(bot, groupId))!,
                memberData.user_id,
                memberData.nickname,
                memberData.card,
                memberData.join_time,
                memberData.last_sent_time,
                GroupMemberPermission.valueOf(memberData.role),
                memberData.unfriendly,
                memberData.title,
                memberData.title_expire_time,
                memberData.shut_up_timestamp,
                memberData.sex,
                memberData.age,
                memberData.area,
                null,
                memberData.level
            )));
        }
        return members;
    }

    /**
     * 同步获取群聊实时成员列表
     * @param bot 机器人
     * @param groupId 群聊号
     * @returns 成员列表
     */
    public static getGroupMembersSync(bot: Bot, groupId: number) {
        let members: Array<GroupMember> | null = [];
        this.getGroupMembers(bot, groupId).then((data) => {
            members = data;
        });
        while (members.length == 0) { }
        return members;
    }

    /**
     * 获取实时群聊成员对象数据
     * @param bot 机器人
     * @param groupId 群聊号
     * @param userId 成员QQ号
     * @returns 成员对象
     */
    public static async getGroupMember(bot: Bot, groupId: number, userId: number) {
        let data = (await this._sendRequestProcess(bot, "get_group_member_info", { group_id: groupId, user_id: userId })).data as ({
            group_id: number,
            user_id: number,
            nickname: string,
            card: string,
            sex: "male" | "female" | "unknown",
            age: number,
            area: string,
            join_time: number,
            last_sent_time: number,
            level: number,
            role: "owner" | "admin" | "member",
            unfriendly: boolean,
            title: string,
            title_expire_time: number,
            card_changeable: boolean,
            shut_up_timestamp: number
        }) | null;
        if (data != null) {
            return new GroupMember(
                (await this.getGroup(bot, groupId))!,
                data.user_id,
                data.nickname,
                data.card,
                data.join_time,
                data.last_sent_time,
                GroupMemberPermission.valueOf(data.role),
                data.unfriendly,
                data.title,
                data.title_expire_time,
                data.shut_up_timestamp,
                data.sex,
                data.age,
                data.area,
                null,
                data.level
            );
        }
        return null;
    }

    /**
     * 同步获取实时群聊成员对象数据
     * @param bot 机器人
     * @param groupId 群聊号
     * @param userId 成员QQ号
     * @returns 成员对象
     */
    public static getGroupMemberSync(bot: Bot, groupId: number, userId: number) {
        let member: GroupMember | null | undefined;
        this.getGroupMember(bot, groupId, userId).then((data) => {
            member = data;
        });
        while (undefined === member) { }
        return member;
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
            string = string.substring(0, CQCodeIndex) + `§d[${await fun(name, BotAPI.objectifyCQCode(data))}]§r` + string.substring(CCLIndex);
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

class EventCaller extends Listener {

    public processMetaEvent(bot: Bot) {

    }

}