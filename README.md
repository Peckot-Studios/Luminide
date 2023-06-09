# Luminide

一个基于 OneBot 标准的 WebSocket Client 插件加载框架  
推荐与 go-cqhttp 配合使用

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br/>

<!-- PROJECT LOGO -->

<p align="center">
  <a href="https://github.com/Peckot-Studios/Luminide">
    <img src="Luminide.png" alt="Luminide" width="500" height="500">
  </a>

  <h3 align="center">一个基于 OneBot 标准的 WebSocket Client 插件加载框架</h3>
  <p align="center">
    代码跑起来我们再聊！
    <br />
</a>
    <br />
    <br />
    <a href="https://github.com/Peckot-Studios/Luminide">查看仓库</a>
    ·
    <a href="https://github.com/Peckot-Studios/Luminide/issues">上报漏洞</a>
    ·
    <a href="https://github.com/Peckot-Studios/Luminide/issues">功能建议</a>
  </p>

</p>

## 目录

TODO: 待编辑……

## 快速上手

1. 前往 [Releases](/releases) 页面下载最新正式版本的 Luminide 客户端；
2. 安装 [go-cqhttp](https://github.com/Mrs4s/go-cqhttp) 或其他 [OneBot](https://onebot.dev/) 标准的机器人后端，设置为正向 WebSocket 连接；
3. 启动 `LuminideStart.exe` (Linux使用 `./LuminideStart` ) 安装相关依赖文件；
4. 修改 `config.json` ，更改 WebSocket 地址、端口和其他内容；
5. 再次启动 Luminide 客户端！
6. Enjoy it <3

***更多内容请参阅 [用户安装指南](#用户安装指南) 和 [插件开发指南](#插件开发指南)***

## 详细介绍

### 配置文件说明

> 注：暂未支持多机器人对接

```json
{
  "LuminideBot": {                      // 机器人名称
    "debug": false,                     // 调试模式
    "websocket": {
      "address": "ws://localhost:5555", // WebSocket地址
      "reconnect": 5,                   // 重连次数
      "reconnect_time": 4               // 重连间隔
    },
    "log": {
      "file": "luminide-{Y}{M}{D}.log", // 日志文件
      "message": true,                  // 是否记录消息
      "notice": true                    // 是否记录通知
    }
  }
}
```

### 用户安装指南

1. 前往 [Releases](/releases) 下载稳定版或从 [Actions](/actions) 下载测试版（不推荐）；
2. 安装 Node.js 等必要的框架或依赖：

```sh
# Windows 请自行前往 Node.js 官网下载安装程序

# Linux/Debian
sudo apt-get install nodejs npm             # 安装 Node.js
chmod +x ./LuminideStart && ./LuminideStart # 设置权限并启动
```

3. 启动 Luminide：

```sh
./LuminideStart     # Linux
LuminideStart.exe   # Windows
```

#### 插件开发指南

1. 安装 Node.js ( Linux 上还要安装 npm )；
2. 克隆仓库或前往 Releases 下载 Luminide 框架；
3. 运行一次 `LuminideStart`，安装所需依赖；
4. 下载 [go-cqhttp](https://github.com/Mrs4s/go-cqhttp) 或其他 [OntBot](https://onebot.dev/) 协议的机器人作为后端；
5. 下载 [Luminide-Tutorial](https://github.com/Peckot-Studios/Luminide-Tutorial) 插件开发模板或自行开发；
6. 将插件放在 `./plugins/` 目录下；  
*(注意文件夹名需要和插件项目 `package.json` 中的 `name` 一致)*
7. 运行 `LuminideStart`，开始你的开发之旅！

### 文件目录说明

```c
FileTree：
├── /logs           // Luminide 日志目录
├── /node_modules   // Node.js 的依赖文件夹
├── /plugins        // Luminide 插件目录
│   ├── xx          // 插件
│   └── xx
├── /src            // Luminide 程序目录（勿编辑）
├── LICENSE         // Luminide 项目许可证
├── Luminide.png    // Luminide 图标
├── Luminide.exe    // Windows 启动文件
├── Luminide        // Linux 启动文件
├── package.json    // Luminide 包管理文件
└── README.md       // 您正在阅读的这个文件
```

## 如何参与此项目？

贡献使开源社区成为一个学习、激励和创造的绝佳场所。  
您所作的任何贡献都是**让我们非常感谢**的。

1. Fork 这个项目
2. 创建你的"Feature Branch",例如 (```git checkout -b feature/AmazingFeature```)
3. Commit你的更改 (```git commit -m 'Add some Amazing Feature'```)
4. 将更改推到你的分支上 (```git push origin feature/AmazingFeature```)
5. 开始PR

# Forker：以下内容正等待更新……

#### 一些额外注意事项

1. TMBot已经为你写好了一些基础接口实现，
例如:

```
tools/data: JsonConfigFileClass,IniConfigFileClass,
tools/file: FileClass.readFrom,
            FileClass.writeLine,
            FileClass.createDir,
            FileClass.delete,
            FileClass.exists,
            FileClass.copy,
            FileClass.move,
            FileClass.rename,
            FileClass.getFileSize,
            FileClass.checkIsDir,
            FileClass.getFilesList,
tools/logger: Logger
```

2. TMBot是先登录完成所有配置的WS连接然后再加载插件的
3. TMBot已经实现了OneBot标准的连接，你可以使用 modules/BotDockingMgr 的 BotDockingMgr.getBot 来获取已连接实例
4. TMBot框架会自动为插件安装依赖,可以直接将没有node_modules的插件放入plugins运行
5. TMBot会自行检索插件的package.json所规定的依赖是否在插件目录是否完整
6. TMBot插件发行形式必须以Node包的形式发布!不要包含TMBot的任何东西!不要修改源代码!必须可以直接解压至plugins目录运行!
7. TMBot框架的插件是以Node包形式存在， 所以你可以在你的项目里随意引用所有模块
(请不要随意"使用"内部功能实现的模块) 如：```OneBotDocking```， ```PluginLoader```，```Websocket```。
虽然不可以使用，但是可以引用它内部的方法作为参数类型
8. 请在你正在使用的WS实例销毁时一并结束你的插件的一切工作,例子:

```js
let tmp = BotDockingMgr.getBot("xxx");
let sid = setInterval(()=>{},1000);
tmp.Client.events.onDestroy.on(()=>{
    clearInterval(sid);
})
```

### 版本控制

该项目使用Git进行版本管理。您可以在GitHub查看当前可用版本。

### 分支作者

Pectics
QQ: 2671876934

 *您也可以在贡献者名单中参看所有参与该项目的开发者。*

### 版权说明

该项目使用 GPL-3.0 授权许可，详情请参阅 [LICENSE](https://github.com/TMBotDev/TMBot/blob/master/LICENSE)

### 鸣谢

<!-- links -->
[contributors-shield]: https://img.shields.io/github/contributors/TMBotDev/TMBot.svg?style=flat-square
[contributors-url]: https://github.com/TMBotDev/TMBot/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/TMBotDev/TMBot.svg?style=flat-square
[forks-url]: https://github.com/TMBotDev/TMBot/network/members
[stars-shield]: https://img.shields.io/github/stars/TMBotDev/TMBot.svg?style=flat-square
[stars-url]: https://github.com/TMBotDev/TMBot/stargazers
[issues-shield]: https://img.shields.io/github/issues/TMBotDev/TMBot.svg?style=flat-square
[issues-url]: https://img.shields.io/github/issues/TMBotDev/TMBot.svg
[license-shield]: https://img.shields.io/github/license/TMBotDev/TMBot.svg?style=flat-square
[license-url]: https://github.com/TMBotDev/TMBot/blob/master/LICENSE
