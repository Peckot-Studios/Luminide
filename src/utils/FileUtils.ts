import * as fs from "fs";
import * as path from "path";
import { version } from "../../App";
import { Logger } from "../entities/system/Logger";

let standardPath = (() => {
    let dir = path.dirname(path.relative("./", process.cwd()));
    // dir = path.join(path.dirname(path.dirname(path.dirname(dir))), "bedrock_server/");
    return dir.replace(/\\/g, "/");
    // return "./"
})();

function getStandardPath(filePath: string): string | null {
    filePath = filePath.replace(/\\/g, "/");
    if (filePath[1] == ":") {
        return filePath;
    }
    if (filePath[0] == "." && filePath[1] == "/") {
        return path.join(standardPath, filePath.substring(2));
    } else {
        return path.join(standardPath, filePath);
    }
}

function mkdirSync(dirname: string) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
        } else {
            fs.mkdirSync(path.dirname(dirname));
        }
        return true;
    }
}

function delFile(p: string) {
    try {
        if (fs.statSync(p).isFile()) {
            fs.unlinkSync(p);
            return true;
        }
        if (fs.existsSync(p)) {
            let list = fs.readdirSync(p);
            list.forEach((v, i) => {
                let path = `${p}/${v}`,
                    stats = fs.statSync(path);
                if (stats.isFile()) {
                    fs.unlinkSync(path)
                } else {
                    delFile(path);
                }
            });
            fs.rmdirSync(p);
            return true;
        }
    } catch (_) {
        return false;
    }
}

const copy = (sd: string, td: string) => {
    // 读取目录下的文件，返回文件名及文件类型{name: 'xxx.txt, [Symbol(type)]: 1 }
    const sourceFile = fs.readdirSync(sd, { withFileTypes: true })
    for (const file of sourceFile) {
        // 源文件 地址+文件名
        const srcFile = path.resolve(sd, file.name);
        // 目标文件
        const tagFile = path.resolve(td, file.name);
        // 文件是目录且未创建
        if (file.isDirectory() && !fs.existsSync(tagFile)) {
            fs.mkdirSync(tagFile);
            copy(srcFile, tagFile);
        } else if (file.isDirectory() && fs.existsSync(tagFile)) {
            // 文件时目录且已存在
            copy(srcFile, tagFile);
        }
        if (!file.isDirectory()) { fs.copyFileSync(srcFile, tagFile, fs.constants.COPYFILE_FICLONE); }
    }
    return true;
}
//   作者：Sin小熊猫
//   链接：https://juejin.cn/post/7050841255047069703
//   来源：稀土掘金

export class FileClass {
    constructor() { };
    static getStandardPath(str: string) {
        return getStandardPath(str);
    }
    static readFrom(filePath: string) {
        let stdPath = getStandardPath(filePath);
        if (stdPath == null) { throw new Error(`FileClass::ReadFrom: 无法获取标准路径<${filePath}>`); }
        if (version.alhpa) {
            new Logger("FileClass").info("Alpha: " + stdPath);
        }
        mkdirSync(path.dirname(stdPath));
        let res: string | null = null;
        try { res = fs.readFileSync(stdPath, { "flag": "r" }).toString(); } catch (_) { }
        return res;
    }
    static writeTo(path1: string, content: string) {
        let ph = getStandardPath(path1);
        if (ph == null) { throw new Error(`FileClass::WriteTo 无法获取标准路径<${path1}>`); }
        mkdirSync(path.dirname(ph));
        let res = false;
        try { fs.writeFileSync(ph, content, { "flag": "w" }); res = true; } catch (_) { }
        return res;
    }
    static writeLine(path1: string, content: string) {
        let ph = getStandardPath(path1);
        if (ph == null) { throw new Error(`FileClass::WriteLine 无法获取标准路径<${path1}>`); }
        mkdirSync(path.dirname(ph));
        let res = false;
        try { fs.appendFileSync(ph, content); res = true; } catch (_) { }
        return res;
    }
    static createDir(dir: string) {
        let ph = getStandardPath(dir);
        if (ph == null) { throw new Error(`FileClass::CreateDir 无法获取标准路径<${dir}>`); }
        return mkdirSync(ph);
    }
    static mkdir(dir: string) { return this.createDir(dir); }
    static delete(path: string) {
        let ph = getStandardPath(path);
        if (ph == null) { throw new Error(`FileClass::Delete 无法获取标准路径<${path}>`); }
        return delFile(ph);
    }
    static exists(path: string) {
        let ph = getStandardPath(path);
        if (ph == null) { throw new Error(`FileClass::Exists 无法获取标准路径<${path}>`); }
        return fs.existsSync(ph);
    }
    static copy(path1: string, to: string) {
        let ph = getStandardPath(path1);
        let toPh = getStandardPath(to);
        if (ph == null) { throw new Error(`FileClass::Copy 无法获取标准<Path>路径<${path1}>`) }
        if (toPh == null) { throw new Error(`FileClass::Copy 无法获取标准<To>路径<${path}>`); }
        if (!this.exists(ph)) { return false; }
        let stat = fs.statSync(ph);
        let res = false;
        if (stat.isDirectory()) {
            res = copy(ph, toPh);
        } else {
            mkdirSync(path.dirname(toPh));
            try { fs.copyFileSync(ph, toPh); res = true; } catch (_) { }
        }
        return res;
    }
    static move(path1: string, to: string) {
        let ph = getStandardPath(path1);
        let toPh = getStandardPath(to);
        if (ph == null) { throw new Error(`FileClass::Move 无法获取标准<Path>路径<${path1}>`) }
        if (toPh == null) { throw new Error(`FileClass::Move 无法获取标准<To>路径<${path}>`); }
        if (!this.exists(ph)) { return false; }
        return delFile(ph);
    }
    static rename(path1: string, to: string) {
        let ph = getStandardPath(path1);
        if (ph == null) { throw new Error(`FileClass::ReName 无法获取标准路径<${path1}>`); }
        if (!this.exists(ph)) { return false; }
        fs.renameSync(ph, to);
    }
    static getFileSize(path1: string) {
        let ph = getStandardPath(path1);
        if (ph == null) { throw new Error(`FileClass::getFileSize 无法获取标准路径<${path1}>`); }
        if (this.exists(ph)) { return -1; }
        let stat = fs.statSync(ph);
        if (stat.isDirectory()) {
            return -1;
        } else { stat.size; }
    }
    static checkIsDir(path1: string) {
        let ph = getStandardPath(path1);
        if (ph == null) { throw new Error(`FileClass::checkIsDir 无法获取标准路径<${path1}>`); }
        if (!this.exists(ph)) { return false; }
        let stat = fs.statSync(ph);
        return stat.isDirectory();
    }
    static getFilesList(path1: string) {
        let ph = getStandardPath(path1);
        if (ph == null) { throw new Error(`FileClass::getFilesList 无法获取标准路径<${path1}>`); }
        if (!this.exists(ph)) { return []; }
        let stat = fs.statSync(ph);
        if (stat.isDirectory()) { return []; }
        return fs.readdirSync(ph);
    }
}