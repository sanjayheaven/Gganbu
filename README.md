<h1 align="center" >Gganbu </h1>

<p align="center">Gganbu - 一体化 Web 开发框架 </p>

Gganbu 是致力于提效全栈开发的 Nodejs 框架。  
目前 Gganbu 基于 Koa 作为 Server 框架，前端部分能够与 React 和 Vue 集成。  
当前 Git 库是 Vue3 的项目模板，核心库还未分离。

## 特性

- 前后端一体化开发，在 src 一个目录下开发前后端代码
- 零 Api 调用，从 controller（可配置）目录 引入函数，调用函数自动转换为 Api 请求
- 零 Route 配置，按照文件所在路径 自动配置 Route
- 基于 Vite + TypeScript 开发，支持 React/Vue 等框架
-

## 示例

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
console.log(data)
// 这是 getInfo 函数的返回结果
```

## 中间件

在编写 server 部分代码的时候，我们需要全局中间件，需要单个路由的中间件。  
为了方便，这一块遵循 [midway](https://www.yuque.com/midwayjs/midway_v2/hooks_middleware) 的使用规则。

Gganbu 对中间件的处理 也同样分为三类：

- 全局中间件
- 文件中间件
- 单路由（函数）中间件

### 全局中间件

全局中间件 在 src/controller/configuration.ts 中配置。

```
import {createConfiguration} from './Gganbu/model'

```

### 文件中间件

文件级的中间件在 Controller 文件中定义，能对该文件内所有的函数生效。
用法如下：

```js
export const config = {
  middlewares: [],
}
```

### 路由中间件

单个路由级别的中间件，采用 **wrapController** 来加载中间件
第一个参数是 中间件 配置，第二个参数是要执行的 Controller Action。

```js
export const getInfo = wrapController({ middlewares: [] }, () => {})
```

## 打包

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

## 其他

- 现在 server 的代码 是 **热重启**，看看以后能不能做到 **热更新**
- 如果以后 ts 出现函数的装饰器 @，而不是类方法的，可能替换掉一些 hoc 操作。
  - 关于 [为什么装饰器不能用于函数？](https://www.bookstack.cn/read/es6-3rd/spilt.3.docs-decorator.md)
/src/api/manage/order.ts?t=1637727018245