import { Sex } from "../misc/Sex";
import { Sender } from "../sender/Sender"
import { Group } from "./Group";
import { GroupMemberPermission } from "./GroupMemberPermission";

/**
 * 群聊成员
 */
export class GroupMember extends Sender {

    private group: Group;

    private card: string;
    private joinTimestamp: number;
    private lastSpeakTimestamp: number;
    private permission: GroupMemberPermission;
    private unfriendly: boolean;
    private title: string;
    private titleExpireTimestamp: number;
    private unmuteTimestamp: number;

    private area: string | null;

    constructor(
        group: Group,
        id: number,
        nickname: string,
        card: string,
        joinTimestamp: number,
        lastSpeakTimestamp: number,
        permission: GroupMemberPermission,
        unfriendly: boolean,
        title: string,
        titleExpireTimestamp: number,
        unmuteTimestamp: number,
        sex: Sex | string = Sex.UNKNOWN,
        age: number = 0,
        area: string | null = null,
        qid: string | null = null,
        level: number | null = null,
        loginDays: number | null = null
    ) {
        super(id, nickname, sex, age, qid, level, loginDays);
        this.group = group;
        this.area = area;
        this.card = card;
        this.joinTimestamp = joinTimestamp;
        this.lastSpeakTimestamp = lastSpeakTimestamp;
        this.permission = permission;
        this.unfriendly = unfriendly;
        this.title = title;
        this.titleExpireTimestamp = titleExpireTimestamp;
        this.unmuteTimestamp = unmuteTimestamp;
    }

    public getGroup() { return this.group; }
    public getArea() { return this.area; }
    public getCard() { return this.card; }
    public getJoinTimestamp() { return this.joinTimestamp; }
    public getLastSpeakTimestamp() { return this.lastSpeakTimestamp; }
    public getPermission() { return this.permission; }
    public isUnfriendly() { return this.unfriendly; }
    public getTitle() { return this.title; }
    public getTitleExpireTimestamp() { return this.titleExpireTimestamp; }
    public getUnmuteTimestamp() { return this.unmuteTimestamp; }

}