# 插件

Gganbu 提供插件机制，参考干净架构，Gganbu 将 Web FrameWork UI、DB、Cache 等业务不相关部分作为插件，即插即用。
目前为止，Gganbu 已提供 plugin-koa 作为 web server 框架，提供 plugin-mongodb 作为数据库工具

## Framework

Gganbu 默认提供 plugin-koa 作为 web server 框架。

## DB

Gganbu 默认提供 plugin-mongodb 作为数据库。

## Cache

Gganbu 默认提供 plugin-redis 作为缓存工具。

## 自定义插件

自定插件，需要满足接口规范

```js
export interface Plugin {
  start(config?: any): Promise<any>
  setConfig?(args: any): Promise<any>
}
```
