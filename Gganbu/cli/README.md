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
