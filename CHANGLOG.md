## 3.x.x（future）

- serverless
- SSR
- 自动部署相关

## 2.x.x（beta，进心中）

2.x 主要还是围绕着模块相关，  
增加基础功能，完善项目相关所需的工具

2.x 这个工作是未来持续要进行的，不断修缮

- 面向服务
- 模块化
- 引入插件机制
  - web framework
  - db
  - cache

### 待办

- 如何更好应用面向服务的应用分层？即通用，又限制
- cli 端口监听重启不是很好
- request，使用上没有很好测试验证

### 已完成功能

- 客户端文件上传
- Cache/Redis
- Framework/koa
- DB/Mongodb

## 1.x.x（功能基础，demo 级别，不再维护）

想法的尝试阶段，能够提供 demo 级别的一体化功能，例如

- vite 打包前端文件
- Vite 配置，实现一体化过程
- 实时监听后端代码文件变化，重启 server
- 文件路由解析机制
- 三层级别的中间件
- 全面的 TS 支持
