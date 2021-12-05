<h1 align="center" >Gganbu </h1>

<p align="center">Gganbu - 一体化 Web 开发框架 </p>

<div align="center">

[![npm](https://img.shields.io/npm/v/gganbu)](https://www.npmjs.com/package/gganbu)

</div>

Gganbu 是 致力于提效全栈开发的 Nodejs 框架。  
目前 Gganbu 基于 Koa 作为 Server 框架，前端部分能够与 React 和 Vue 集成。

## ✨ 特性

- 前后端一体化开发，在 src 一个目录下开发前后端代码
- 零 Api 调用，从 controller（可配置）目录 引入函数，调用函数自动转换为 Api 请求
- 零 Route 配置，按照文件所在路径 自动配置 Route
- 基于 Vite + TypeScript 开发，支持 React/Vue 等框架

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

## 🌈 中间件

在编写 server 部分代码的时候，我们需要全局中间件，需要单个路由的中间件。

Gganbu 对中间件的处理 也同样分为三类：

- 全局中间件
- 文件中间件
- 单路由（函数）中间件

### 全局中间件

全局中间件 在 src/controller/configuration.ts 中配置。

```ts
import { defineServerConfig } from "gganbu/dist/config"
export default defineServerConfig({
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

## 📦 打包

### 前端打包

在项目目录下终端窗口，执行以下命令。

```js
npm run build // vite 默认打包方式
```

或者

```js
npm run build:client
```

打包结果在 dist 文件夹中。

### 后端打包

在项目目录下终端窗口，执行以下命令。

```js
npm run build:server
```

打包结果在 dist 文件夹中。
