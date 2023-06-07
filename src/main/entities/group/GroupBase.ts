/**
 * 群聊基础信息
 */
export class GroupBase {

    private id: number;						// 群号
    private name: string;					// 群名称
    private remark: string | null;			// 群备注
    private createTime: number | null;		// 群创建时间
    private level: number | null;			// 群等级
    private memberCount: number | null;		// 成员数
    private maxMemberCount: number | null;	// 最大成员数

    constructor(
        id: number,
        name: string,
        remark: string,
        createTime: number | null = null,
        level: number | null = null,
        memberCount: number | null = null,
        maxMemberCount: number | null = null
    ) {
        this.id = id;
        this.name = name;
        this.remark = remark;
        this.createTime = createTime == 0 ? null : createTime;
        this.level = level == 0 ? null : level;
        this.memberCount = memberCount == 0 ? null : memberCount;
        this.maxMemberCount = maxMemberCount == 0 ? null : maxMemberCount;
    }

    public getId() { return this.id; }
    public getName() { return this.name; }
    public getRemark() { return this.remark; }
    public getCreateTime() { return this.createTime; }
    public getLevel() { return this.level; }
    public getMemberCount() { return this.memberCount; }
    public getMaxMemberCount() { return this.maxMemberCount; }

    public toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this)}`; }

}