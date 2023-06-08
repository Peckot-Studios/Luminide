/**
 * 登录设备
 */
export class Device {

    constructor(
        private appId: number,
        private deviceName: string,
        private deviceType: string
    ) { }

    public getAppId() { return this.appId; }
    public getDeviceName() { return this.deviceName; }
    public getDeviceType() { return this.deviceType; }

    public toString() { return `<Class::${this.constructor.name}>\n${JSON.stringify(this)}`; }

}