# 介绍

Gganbu 是 致力于提效全栈开发的 Nodejs 框架。  
目前 Gganbu 基于 Koa 作为 Server 框架，前端部分能够与 React 和 Vue 集成。

## ✨ 特性

- 前后端一体化开发，在 src 一个目录下开发前后端代码
- 零 Api 调用，从 controller（可配置）目录 引入函数，调用函数自动转换为 Api 请求
- 零 Route 配置，按照文件所在路径 自动配置 Route
- 基于 Vite + TypeScript 开发，支持 React/Vue 等框架

## 示例

Gganbu 允许开发者在 一个 src 目录上，同时编写前后端代码。

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
