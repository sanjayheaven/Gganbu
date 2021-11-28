# cli

## 目的

原先是采用 在 vite dev server 直接调用启动 server App。  
但是在同一个进程下，vite 服务器会因为，server app 启动而受影响。  
所以新开进程，用来启动 server

## 需要做的几件事

- 监听文件变化 重启 server
- 启动命令
- 关闭命令
- 检测端口，重新分配端口

## bug

### fork 第一个参数报错找不到路径

直接 用 vite 调用这个 cli 模块，
报错 **Cannot find module 'D:\Github\Gganbu\Gganbu\cli\child'**  
可能是需要这个包单独先发布。

**解决方案**

采用 JITI 库，引入 **childModule.js** 注意是 **js** 文件。 在这个文件中，采用 **cjs** 写法。

### 每次修改监听文件，watcher 重启太多次了

这是因为 node 的事件循环机制，原先在 restart 之后 标记 restarting 为 false，导致不及时。  
需要 监听子进程完成任务，forke.on('message'),这之后再标记 restarting 为 false
