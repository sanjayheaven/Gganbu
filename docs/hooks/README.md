# Hooks

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

## 内置 Hook

Gganbu 采用 **AsyncLocalStorage**，来共享异步资源状态。

### useContext

获取请求上下文

```js
import { useContext } from "gganbu"
export
```

## 自定义 Hook

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
