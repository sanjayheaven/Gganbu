<h1 align="center" >Gganbu </h1>

<p align="center">Gganbu - 面向未来的一体化 Web开发框架 </p>

## Features

## 功能

- 前端 Api 请求以**页面内容**为单位
  - 仅限使用 **GET**/**POST** 方法
- 根据 Schema 自动生成 DB Services 的基础操作
  - 包括 增删改查。其中，查询列表信息 暴露，**筛选**，**排序**，等选项
- 利用 koa 洋葱模型，编写业务代码

## Middlewares

**全局中间件**

## Routes

为什么要把 不同前端 app 隔离开，  
很多时候 我们开发应用，都会是根据前端需求，来定义接口。  
通常有几种方案

- 页面发起多个请求，获取不同数据
  - 利：server 接口重复利用，
  - 弊：网络对性能影响较大，项目可控性较差，每次接口变化，需要在前端修改。
- 页面发起一个请求，server 根据请求内容解析对应内容。
  - 利：减少了网络影响
  - 弊：每一个请求，基本需要自定义，

这两者鲜明的代表分别是 **RESTful Api** 和 **GraphQL**。

**RESTful Api**根据资源定义路由接口，能够实现资源获取的的最小单元。
**GraphQL** 根据请求的内容，解析每一个字段，同一页面获取信息，只需要一次请求。

我们借鉴 **GraphQL** 的数据获取方式，定义接口规范。

请求方法 仅限 GET POST

| Method | Path     | Controller Action |
| ------ | -------- | ----------------- |
| GET    | SomeName | SomeName          |
| POST   | SomeName | SomeName          |

一个页面仅限发出 一个 GET 请求。
例如订单页面中我们需要获取 订单信息，产品信息，那只需要

```js
// pages/order.js
request.get("/getInfo", { orders: 1, products: 1 })
```

需要针对 **orders** **products** 两个请求字段，在 server 解析需要返回的资源数据。

```js
// controllers/manage/order.js
module.exports = () => {
  getInfo: async (ctx) => {
    let { orders, products } = ctx.query
    let ordersRes = (orders && (await OrderService.getOrders())) || []
    let productsRes = (products && (await ProductService.getProducts())) || []
    ctx.body = { orders: ordersRes, products: productsRes }
  }
}
```

这里仍可以优化，当我们在多个页面需要获取相同信息的时候，我们需要提供某个接口，做 **全局解析**。

基于这样的规范，我们在开发过程中，很轻松找到对应的 Controller Action, 并且尽可能地提高了性能，尽量使得获取信息在一次请求中完成。

## Controllers

争对 每一个应用，每一个路由 **Route**，有自己的对应的 **Controller**。

如上图所示，将规定，Controller Action 的函数接口，直接等同于 路由的 path。
例如

```js
// routes/order.js
const Controller = require("./controllers/order")
router.get("/getOrders", Controller.getOrders)
router.post("/updateOrder", Controller.updateOrder)
```

```js
// controllers/order.js
module.exports = {
  getOrders: async (ctx) => {
    ctx.body = {}
  },
  updateOrder: async (ctx) => {
    ctx.body = {}
  },
}
```

**为什么这么做？**  
希望通过同一名称，在开发过程中 向上排查问题的时候，忽略 过程。
继续上面的例子，在页面发起调用 **Api**, **Api** 请求 server 匹配路由，如果这时候我们都是每一个过程都设置不同的关卡，整个开发效率显著降低。  
我们最好希望 能从前端 直接发起对 server 的 **controllers** 的请求。  
当然 实际项目不允许这么操作，那只能从开发体验上提高，我们将 路由 和 前端 Api 封装好，约定好各部分名称，在 调试开发时候，能够直接忽略 路由和 api 的影响，大大提高了开发效率。

## Services

与其他框架的 Services 划分不同，这里的 Services 是独立的，与 Controllers 隔离，也就是在 Services 中 不能直接访问到 Controllers 的 请求上下文。  
**eggjs 中 可以直接在 Services 访问全局配置，访问请求上下文等，这种方式，可能更符合 AOP 编程方式**

Service 更像是一个个纯函数，然后由 Controller 根据实际业务去组合调用。  
这样的情况下，Services 的单元测试将更针对性，抽象和复用程度更高。
**当时这么设计 Services 的主要目的，也是为了 能够让 DB Services 能够复用, 可控性更强。**

Services 服务包含三种类型，按优先级排序。

- Business Services 业务服务
- Util Servcies 其他服务
- DB Services 数据库操作

### Business Services

当且仅当，**controllers** 部分有大量重复代码 需要抽象。  
例如，我们现在有这样子一个业务场景：  
生成订单之后，需要 更新 产品销量，更新会员积分，  
**controllers** 大概的伪代码是

```js
// controllers/manage
const { OrderService } = require("../services")
const { create, updateProductSale, updateMemberPoints } = OrderService
const createOrder = (ctx) => {
  let context = {}
  let res = compose([create, updateProductSale, updateMemberPoints])(context)
  ctx.body = res
}
module.exports = {
  createOrder,
}
```

我们会发现这样的场景，可能会在很多 不同的 **controller** 中出现，  
比如 后台下单，客户端下单，如果还有不同途径的下单，那这块代码，将会来来回回出现。  
这个时候 为了保持 controllers 的业务整洁性，和 这部分 创建订单业务逻辑 的独立性。需要抽象出一个 **业务类型的服务**

```js
// controllers/manage
const { OrderService } = require("../services")
module.exports = {
  createOrder: async (ctx) => {
    let info = ctx.request.body
    let res = await OrderService.createOrder(info)
    ctx.body = res
  },
}
```

```js
// controllers/client
const { OrderService } = require("../services")
module.exports = {
  createOrder: async (ctx) => {
    let info = ctx.request.body
    let res = await OrderService.createOrder(info)
    ctx.body = res
  },
}
```

```js
// controllers/business/order
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

可以看到，通常业务类型的代码，是解决了 **controllers** 的重复问题，更多的是接口的整合。

## Util Services

其他服务，一般如 第三方接口，如上传文件到资源服务器，或者 sms 服务等。

### DB Services

数据库类型的服务。
在这里，我们以 mongodb 为例，说明数据库服务。未来考虑适用于不同数据库接口。

数据库服务，分为三层结构，

- **model**，根据 Schme 表，利用 moongoose 生成的数据库模型，
- **basic**，在模型的基础上，针对**单表**生成较为基础的增删改查服务，这部分**强烈建议**自动生成。
- **uitl**，当涉及到复杂的数据库操作，需要直接操作数据库模型的操作，比如统计，联表等操作。

三者优先级，逐次递增，当 **util** 中出现相同的接口，将会覆盖 **basic** 中的同名接口。  
例如，当业务较为简单时候，我们在 **basic** 自动生成 getOrders 接口，随着业务规模增长，需要对产品等其他信息进行联表查询，这个时候需要在 **utils** 重写 getOrders，扩展其他信息，或者利用几个 basic 的数据库接口，重新组合。**推荐后者**。

整个 DB Services 对外暴露接口仅，**basic** 、 **util**、**connect**。  
**model** 只对数据库本身服务开放。

```js
module.exports = {
  basic: {},
  utils: {},
  connect: async (dbaddress) => {},
}
```

- **connect**， 是 db 连接方式，需要在 app 启动的时候，先连接数据库。

**数据库无关**
可以看到，整个 DB Services，相关操作，对于外界来说都只是一个接口，从 Controllers 调用数据库的数据时候，根本不知道用的哪个数据库。

## 待/可优化

- 根据 **schema**，自动完成 **models** 的生成
  - 优势：model 名称，与文件名，保持一致。

## 开发计划

### 项目结构

- 前期版本，以自动化脚本生成相关代码。为了能够通过目录结构作用，表现整个框架的功能。
- 后期版本，融入 runtime，通过编译手段，提高开发体验。
  - 将直接隐藏 部分内容，比如 **routes**，开发者直接从前端 调用 **Controller Action**。
  - 也可以避免 开发者直接接触 自动化生成的目录，眼不见心不烦。
  - 同样也可以，将项目更灵活的划分，如果应用需要单体部署，那就需要按需分配内容

### 项目内容

- 目前还是针对 server 的一些配置，前期先实现 一种 server + 前端框架（Vue、React）的方式
- 后期，抽象基础，尝试做到前端框架无关。

## 其他

20211029 midway 的核心思想 - 依赖注入，常见标准的后端开发方式，常见于 python java  
在 controller 类中 注入 service，由容器，自动生成所需的类实例。
