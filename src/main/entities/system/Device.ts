/**
 * 登录设备
 */
export class Device {

    private appId: number;
    private deviceName: string;
    private deviceType: string;

    constructor(
        appId: number,
        deviceName: string,
        deviceType: string
    ) {
        this.appId = appId;
        this.deviceName = deviceName;
        this.deviceType = deviceType;
    }

    public getAppId() { return this.appId; }
    public getDeviceName() { return this.deviceName; }
    public getDeviceType() { return this.deviceType; }

    public toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this)}`; }

}