# cli

## 目的

原先是采用 在 vite dev server 直接调用启动 server App。  
但是在同一个进程下，vite 服务器会因为，server app 启动而受影响。  
所以新开进程，用来启动 server

本来能够利用 vite 本身自己的监听行为，做**重启**处理其实很好的。

## 功能

- 监听 src 目录下的文件，目前仅监听 ts 文件（除开 node_modules）
- 新开子进程，启动 server，
- 监听并重启 server

## 需要做的几件事

- 监听文件变化 重启 server（已完成）
- 启动命令 （已完成）
- 关闭命令 （已完成）

## start 需要注意的地方

- 需要判断 是否已经启动过
  - 改变 vite.config.ts 会再 start cli 导致端口占用
    - 解决方案，已经启动，必须是 restart
  - 如果第一次检测，需要检测端口
    - checkPort

## Bug

### fork 第一个参数报错找不到路径

直接 用 vite 调用这个 cli 模块，
报错 **Cannot find module 'D:\Github\Gganbu\Gganbu\cli\child'**

**解决方案**

采用 JITI 库，引入 **childModule.js** 注意是 **js** 文件。 在这个文件中，采用 **cjs** 写法。

### 每次修改监听文件，watcher 重启太多次了

这是因为 node 的事件循环机制，原先在 restart 之后 标记 restarting 为 false，导致不及时。  
需要 监听子进程完成任务，forke.on('message'),这之后再标记 restarting 为 false

### ora 库 无法使用

会报错，require 问题，无法在 esm 下使用 require 机制

**解决方案**

采用 **light-spinner** 替换 ora，  
有个功能特别好，提供写入流接口，可以用作记录 **启动日志**。
