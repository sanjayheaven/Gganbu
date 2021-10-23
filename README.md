# 基于 Koa2 的 server 脚手架

## 前言

为什么会出现这个脚手架，**快速启动项目** 和**规范**  
为什么关于数据库操作，推荐使用 基本操作，而不是直接操作数据库，尽可能的去用到数据库一些复杂的 api 实现。**性能** 和 **高复用**

## 致敬

## 谁合适？

## 功能

- Api 请求以页面为单位
  - 仅限使用 **get**/**post** 方法
- 根据 Schema 自动生成 DB Services 的基础操作
  - 包括 增删改查。其中，查询列表信息 暴露，**筛选**，**排序**，等选项
- 利用 koa 洋葱模型，编写业务代码

## Middlewares

**全局中间件**

## Routes & Controllers

## Services

### DB Services

**数据库类型服务**

暴露接口，如下

```js
module.exports = {
  models: {},
  basic: {},
  utils: {},
  connect: async (dbaddress) => {},
}
```

- **models**， 数据库模型，仅建议在 **utils** 调用操作。**不对外暴露**
- **basic**，内部文件是根据 models 每个文件，生成对应的基础数据操作。
- **utils**， 只有当基础操作不满足要求，比如复杂的统计信息，需要直接操作数据库，新写一些数据库接口。
- **connect**， 是 db 连接方式，需要在 app 启动的时候，先连接数据库。

## 待/可优化

- 根据 **schema**，自动完成 **models** 的生成
  - 优势：model 名称，与文件名，保持一致。

### Business Services

**业务类型服务**

当且仅当，**controllers** 部分有大量重复代码 需要抽象。  
例如，我们现在有这样子一个业务场景：  
生成订单之后，需要 更新 产品销量，更新会员积分，  
**controllers** 大概的伪代码是

```js
const createOrder = (ctx) => {
  let context = {}
  const create = (context, next) => {
    await next()
  }
  const updateProductSale = (context, next) => {
    await next()
  }
  const updateMemberPoints = (context, next) => {
    await next()
  }
  let res = compose([create, updateProductSale, updateMemberPoints])(context)
  ctx.body = res
}
```

我们会发现这样的场景，可能会在很多 **controllers** 出现，  
比如 后台下单，客户端下单，如果还有不同途径的下单，那这块代码，将会来来回回出现，需要抽象出一个 **业务类新的服务**

## Util Services

**其它类型的服务**

通常将 **第三方服务** 调用接口 放置于这部分中

- 支付
- 资源上传
- 地图
- 短信
- etc
