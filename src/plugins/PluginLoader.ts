import { readdirSync, readFileSync, statSync } from "fs";
import path from "path";
import { FileClass } from "../utils/FileUtils";
import { Logger } from "../entities/system/Logger";
import * as child_process from 'child_process';

const PLUGIN_DIR = "./plugins/";

let loadedPlugins = new Map<string, Plugin>();

let logger = new Logger("PluginLoader");

export class Plugin {
    public exports: NodeRequire | undefined;
    constructor(
        public dir: string,
        public name: string,
        public desc: string | undefined,
        public version: string | undefined
    ) { }
    checkDependencies() {
        let PluginPath = path.join(this.dir, "package.json");
        let pluginObj = JSON.parse(readFileSync(FileClass.getStandardPath(PluginPath)!, "utf8"));
        try {
            for (let key in pluginObj.dependencies || {}) {
                let ModuleDir = path.join(this.dir, `node_modules/${key}`);
                try {
                    if (!statSync(FileClass.getStandardPath(ModuleDir)!).isDirectory()) {
                        throw new Error("");
                    }
                } catch (_e) {
                    let e = _e as Error;
                    e.message = `未安装插件依赖包 [${key}]！插件 [${this.dir}] 加载失败！`;
                    throw e;
                }
            }
        } catch (_e) {
            // console.log(this.dir);
            child_process.execSync(
                `cd "${FileClass.getStandardPath(this.dir)}" && npm i`,
                { "stdio": "inherit" }
            );
        }
    }
    load() {
        // console.log();
        this.checkDependencies();
        try {
            this.exports = require("./../" + this.dir);
            loadedPlugins.set(this.name, this);
        } catch (_e) {
            let e = _e as Error;
            e.message = `插件 [${this.dir}] 加载失败！\n${e.message}`;
            throw e;
        }
    }
    toJson() {
        return {
            dir: this.dir,
            name: this.name,
            desc: this.desc,
            version: this.version
        };
    }
}

export class PluginLoader {
    public static async loadAllPlugins() {
        logger.log(`正在加载插件…`);
        if (!FileClass.exists(PLUGIN_DIR)) {
            logger.info(`插件加载目录不存在！自动创建…`);
            FileClass.mkdir(PLUGIN_DIR);
        }
        let dirs = readdirSync(FileClass.getStandardPath(PLUGIN_DIR)!, { "withFileTypes": true });
        let l = dirs.length, i = 0;
        while (i < l) {
            let dir = dirs[i++];
            if (dir.isDirectory() && (dir.name).toLowerCase() != "data") {
                let fullDir = PLUGIN_DIR + dir.name;
                let tmp = this.loadPlugin(fullDir);
                if (tmp) {
                    logger.info(`插件 [${fullDir}] 加载成功！`);
                } else {
                    logger.error(`插件 [${fullDir}] 加载失败！`);
                }
            }
        }
        if (i == 0) logger.log(`没有找到插件！`);
        else logger.log(`插件加载完成！`);
    }
    public static loadPlugin(dir: string) {
        try {
            let PluginPath = path.join(dir, "package.json");
            let pluginObj = JSON.parse(readFileSync(FileClass.getStandardPath(PluginPath)!, "utf8"));
            if (pluginObj.name != dir.replace(PLUGIN_DIR, "")) {
                throw new Error(`插件名称应和插件目录名相同！`);
            }
            let tmp = new Plugin(dir, pluginObj.name, pluginObj.description, pluginObj.version);
            tmp.load();
            return tmp;
        } catch (e) {
            logger.error(`Error in load plugin: [${dir}]`);
            logger.error((e as Error).stack);
            return undefined;
        }
    }
}