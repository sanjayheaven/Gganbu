# Gganbu/hooks

这部分，最终会抽离出来 成为一个工具。

现在这部分 依赖于配置文件中的 路由前缀。这个设置可以默认，  
那 依赖的 controller 路径怎么解决。
可能在 server/controller 这样子 通过目录结构 强制性规范。。。

## 引入 AsyncLocalStorage 解决请求上下文共享的问题

怎么 在 vite 那边 获取 controllers 的所有 acntion呢