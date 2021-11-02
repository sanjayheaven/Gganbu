# 为什么要封装 controller 当中的函数

如果我们正常操作，会类似如下，

```js
module.exports = {
  getInfo: (ctx) => {
    //  某些操作
    ctx.body = {}
  },
}
```

可以发现，我们整个函数依赖于 ctx。ctx 是整个请求上下文。  
从架构来看，首先就不太好，整个函数依赖于请求上下文。
其次为了实现，在开发过程中，忽略 http 请求，从前端直接调用后端的 controller action，那么将以传参的方式

封装之后，后端的 **controller** 变成 如下，但是 约定 返回时，将在打包到正式环境的时候，加入请求上下文。

```js
module.exports = {
  getInfo: async (arg) => {
    return "你好啊，我是后端哦"
  },
}
```

而在前端可以直接请求后端的 控制函数，何其快乐。

```js
const {
  Api: { manage },
} = require("../Gganbu")

const { orderApi } = manage

const main = async () => {
  let res = await orderApi.getInfo()
  consolo.log(res) // 你好啊，我是后端哦
}
main()
```

我现在能理解，为什么 midway 也是类似这么处理了。  
好处太多了，随便列几个

- **开发体验**
  - 开发环境下，前端调用这个 controller action 部分，可以直接等同于调用函数，而忽略 http 请求上下文。效果更好。
- **可测试性**
  - 因为抛除了请求上下文 ctx，所以，在测试方面，变得更加容易。
- **框架无关性**
  - 我估计再做下去，就是对不区分是 koa 还是 express 的请求上下文了

但是也有坏处
（目前还没解决）

- **请求上下文对象不可控**
  - 好像无法自定义 请求返回状态？
  - 可以通过 再来一个钩子。 获取请求上下文状态。
    - 这里了解到 node async-hooks
  - 为什么 midway 的 hook 是本地存储的 不能是运行时吗！
- ## **全局中间件好像不起作用了？**
