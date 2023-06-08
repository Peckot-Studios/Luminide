/**
 * 性别资料
 * @enum {string}
 */
export enum Sex {
    MALE = "male",
    FEMALE = "female",
    UNKNOWN = "unknown"
}

export namespace Sex {

    export function valueOf(string: string) {
        switch (string.toLowerCase()) {
            case "male": return Sex.MALE;
            case "female": return Sex.FEMALE;
            default: return Sex.UNKNOWN;
        }
    }
    
}