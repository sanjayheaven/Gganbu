# 中间件

在编写 server 部分代码的时候，我们需要全局中间件，需要单个路由的中间件，或者需要对某个文件内所有函数设置中间件

Gganbu 对中间件的处理分为三类：

- 全局中间件
- 文件中间件
- 单路由（函数）中间件

## 全局中间件

全局中间件 在 **src/controller/configuration.ts** 中配置。

```ts
import { defineServerConfig } from "gganbu/dist/config"
export default defineServerConfig({
  middlewares: [], // 全局中间件
})
```

## 文件中间件

文件级的中间件在 **Controller** 文件中定义，能对该文件内所有的函数生效。  
用法如下：

```js
export const config = {
  middlewares: [],
}
export const ControllerActionA = async () => {}
export const ControllerActionB = async () => {}
```

## 路由中间件

单个路由级别的中间件,

```js
export const getInfo = async () => {}
getInfo.config = { middlewares: [logger] }
```
