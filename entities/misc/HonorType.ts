/**
 * 群聊荣誉类型结构
 */
export type HonorTypeStruct = "talkative" | "rich" | "performer" | "legend" | "emotion";

/**
 * 群聊荣誉类型
 * @enum {string}
 */
export enum HonorType {
    /**
     * 龙王
     */
    TALKATIVE = "talkative",
    /**
     * TODO: 善财福禄寿
     */
    // RICH = "rich",
    /**
     * 群聊之火
     */
    PERFORMER = "performer",
    /**
     * 群聊炽焰
     */
    LEGEND = "legend",
    /**
     * 快乐源泉
     */
    EMOTION = "emotion"
}

export namespace HonorType {
    export function valueOf(string: string) {
        switch (string) {
            case "talkative": return HonorType.TALKATIVE;
            // case "rich": return HonorType.RICH;
            case "performer": return HonorType.PERFORMER;
            case "legend": return HonorType.LEGEND;
            case "emotion": return HonorType.EMOTION;
            default: throw new Error(`无法解析群聊荣誉类型: ${string}`);
        }
    }
}