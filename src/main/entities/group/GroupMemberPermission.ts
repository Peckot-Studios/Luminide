/**
 * 群成员权限
 */
export enum GroupMemberPermission {
    OWNER = "owner",
    ADMIN = "admin",
    MEMBER = "member",
    UNKNOWN = "unknown"
}

export namespace GroupMemberPermission {
    export function valueOf(string: string) {
        switch (string.toLowerCase()) {
            case "owner": return GroupMemberPermission.OWNER;
            case "admin": return GroupMemberPermission.ADMIN;
            case "member": return GroupMemberPermission.MEMBER;
            default: return GroupMemberPermission.UNKNOWN;
        }
    }
}