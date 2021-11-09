# 开发日志

## 想法

- 抽象模型 model 更为精准，不仅仅是多应用的体系。
  - 根据目录结构分配路由路径
- 想要直接跳过路由可分为 get 和 post 直接 post 全部一把梭。
  - 整体的数据获取方式参考 graphql。
  - 并且建立一个全局解析器的概念。resolver 用户指定获取 数组资源。
- 如果要开发直接调用后端函数，需要对 controller 再次封装，将返回值的 赋值给。 ctx.body
  - 哇塞，这样的话，那可以再封装，继续为 controller 增加 一个路由中间件。
- 一体化场景下，能否在开发过程中，直接从前端调用后端的函数。但是正式环境，分开来的。
- 如果一体化开发，要有能力打包出来前后端，前端不用说，后端，希望是整个完整的项目，那就要写入文件。
- 所以需要 server 提供项目初始化的能力。

## 开发计划

- 实现 server 的配置自动化 （已完成）
  - 数据库基础操作自动写入
  - 根据 controllers 自动生成路由
- 封装 controller 为什么要封装 Controller 因为要从前端直接调用后端函数。（已完成）
  - 如果我们以之前的写法 还依赖于 ctx。那 可能很别扭
- 接入运行时，
  - 在 commonjs 体系下，路由配置化，
  - 配置，到接入运行时，相当于 解决 routes 的文件存在，对路由的读取 是否存在在内存中。
  - 在 **一体化** 架构开始的时候，接入 esbuild 运行时，使用 vite 编译
- 实现 api SDK 的配置自动化
  - 接入 前端 framework

## 1109

- 引入 babel，代码由 commonjs 规范变成 ES6+规范

## 1108

- 增加模型 App

## 1107

- 初步规范目录

```js
  ├─src
  │ ├─controllers
  │ │ ├─client
  │ │ └─manage
  │ ├─middlewares
  │ ├─pages
  │ └─services
  │ ├─business
  │ ├─db
  │ │ ├─actions
  │ │ ├─basic
  │ │ └─models
  │ └─util
```

## 1106

- 引入 model 模型 和 hook 钩子的概念
  - model ： Controller Route Router Api
  - hook：useContext,请求上下文
- 利用 als 实现 useContext

## 1101

- 引入 **AsyncLocalStorage** 解决请求上下文共享的问题
  - 对于在同一异步资源中将会维护一份数据，而不会被其它异步资源所修改

## 1030

- 实现 server 运行
- 将路由以配置形式呈现

## 1029

- 到底是根据 路由生成控制器 还是根据 控制器生成路由?
- 能不能 写一个 routes 配置文件 来写 路由？
- 如果根据配置生成 routes 那岂不是，根据路由生成控制器？
- 路由配置文件，让路由更灵活，写入路由中间件更方便。
- 请求缓存，将会参考 **Apollo GraphQL** 的模式
- 增加 **全局解析** 功能，解决单个页面 重复获取资源。
