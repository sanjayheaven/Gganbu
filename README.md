<h1 align="center" >Gganbu </h1>

<p align="center">Gganbu - 一体化 Web 开发框架 </p>

<div align="center">

[![npm](https://img.shields.io/npm/v/gganbu)](https://www.npmjs.com/package/gganbu)

<!-- ![npm](https://img.shields.io/npm/dw/gganbu) -->

</div>

Gganbu, 音 **刚布**，取自于 **鱿鱼游戏**，意为 **最近的朋友，能分享一切**。  
Gganbu 是 致力于提效全栈开发的 Nodejs 框架。  
目前 Gganbu 基于 Koa 作为 Server 框架，前端部分能够与 React 和 Vue 集成。

## 💡 未来

- 引入插件机制，实现 业务逻辑和技术细节分离

## 📚 文档

- [Github Pages](https://sanjayheaven.github.io/Gganbu/)

## ✨ 特性

- 前后端一体化开发，在 src 一个目录下开发前后端代码
- 零 Api 调用，从 controller（可配置）目录 引入函数，调用函数自动转换为 Api 请求
- 零 Route 配置，按照文件所在路径 自动配置 Route
- 基于 Vite + TypeScript 开发，支持 React/Vue 等框架

## 🔨 快速上手

### 安装

```shell
npm install gganbu
```

### Vite 配置

在 **vite.config.ts**中添加插件

```js
import { VitePlugin } from "gganbu"
export default defineConfig({
  plugins: [VitePlugin()],
})
```

## 🏳‍🌈 示例

后端代码 src/controller/order.ts

```js
export const getInfo = async () => {
  return "这是 getInfo 函数的返回结果"
}
```

前端代码 src/app/main.ts

```js
import { getInfo } from "./controller/order.ts"
let data = await getInfo()
console.log(data) // 这是 getInfo 函数的返回结果
```

## 📡 路由

Gganbu 通过文件路径 + 导出方法解析出路由配置。

### 默认解析

将通过以下三个示例来说明 Gganbu 如何解析路由配置。

文件路径 /controller/manage/order.ts

- **getOrder** ➡ **GET** /manage/orders/getOrder
- **createOrder** ➡ **POST** /manage/orders/createOrder
- **default** ➡ **POST** /manage/orders/

当 **Controller Action** 也就是 导出方法 以 **get** 开头的时候，路由方法 对应 **GET**。  
其余则为 **POST** 方法，包括导出的 **default** 方法。  
同时，值得注意的是，Gganbu 会自动将 导出方法所在文件名 解析为**复数形式**。

### 路由设置

#### 全局路由

Gganbu 同时也提供了路由设置，其中全局路由在 **gganbu.config.ts** 中设置。

```js
import { defineConfig } from "gganbu"

export default defineConfig({
  routerPrefix: "/api",
})
```

#### 单个服务的路由

对于早期版本，暂不开放

## 🌈 中间件

在编写 server 部分代码的时候，我们需要全局中间件，需要单个路由的中间件。

Gganbu 对中间件的处理 也同样分为三类：

- 全局中间件
- 文件中间件
- 单路由（函数）中间件

### 全局中间件

全局中间件 在 src/controller/configuration.ts 中配置。

```ts
import { defineConfig } from "gganbu/dist/config"
export default defineConfig({
  middlewares: [], // 全局中间件
  port: 9527,
})
```

### 文件中间件

文件级的中间件在 Controller 文件中定义，能对该文件内所有的函数生效。  
用法如下：

```js
export const someControllerAction = async () => {}
export const config = {
  middlewares: [],
}
```

### 路由中间件

单个路由级别的中间件,

```js
export const getInfo = async () => {}
getInfo.config = { middlewares: [logger] }
```

## 🪝 Hooks

通常，我们在编写后端代码的时候，通常会是如下写法，

```js
export async getOrder(ctx)=>{
    let res = await Service.getOrder()
    ctx.body = res
}
```

为了在一体化开发过程中，我们能更关注业务的实现，Gganbu 隐藏 **请求上下文 Context** 细节。  
所有编写的 **Controller Action** 需要满足以下条件。

```js
export async getOrder()=>{
    let res = await Service.getOrder()
    return res
}
```

其中 函数接收的参数 由前端传入。

**值得注意的是，为了保持中间件的适用性，Gganbu 不会对 中间件做任何处理。**

当我们需要请求上下文信息时候，这之后我们就需要一个钩子调用上下文信息。

### 内置 Hook

Gganbu 采用 **[AsyncLocalStorage](http://nodejs.cn/api/async_context.html#class-asynclocalstorage)**，来共享异步资源状态。

#### useContext

获取请求上下文

```js
import { useContext } from "gganbu"
```

### 自定义 Hook

同样，我们可以通过已有的内置 Hook 来自定义更快捷的 Hook  
通常，自定义 Hook 需要以 **use** 开头。
例如

```js
import { useContext } from "gganbu"
export const useRequest = () => {
  return useContext.request
}
export const useReponse = () => {
  return useContext.response
}
```

## 插件

Gganbu 从 1.2.x 版本开始，引入插件机制，参考干净架构，将 Framework，DB 以及 Cache 等业务不相关部分作为插件，让开发者能够集中更多精力处理业务代码。  
目前为止，Gganbu 已提供 plugin-koa 作为 web server 框架，提供 plugin-mongodb 作为数据库工具

### Framework

Gganbu 默认提供 plugin-koa 作为 web server 框架。

### DB

Gganbu 默认提供 plugin-mongodb 作为数据库。

### 自定义插件

自定插件，需要满足接口规范

```js
export interface Plugin {
  start(config?: any): Promise<any>
  setConfig?(args: any): Promise<any>
}
```

## 📦 打包

### 前端打包

在项目目录下终端窗口，执行以下命令。

```js
npm run build // vite 默认打包方式
```

打包结果在 dist 文件夹中。
