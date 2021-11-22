// 订单相关页面

import { useContext } from "../../../Gganbu/hook"
import { withController } from "../../../Gganbu/middleware"

// const loadMiddleware = (middlewares, func) => {
//   await compose([...middlewares, mafunc])
// }
// const logger = async (next) => {
//   const ctx = useContext()
//   const start = Date.now()
//   await next()
//   const cost = Date.now() - start
//   console.log(`request ${ctx.url} cost ${cost}ms`)
// }
// // @loadMiddleware
// export const getInfo = withController({ middlewares: [logger] }, async () => {
//   return {
//     data: "这是 getInfo 函数的返回结果11111",
//     msg: "OK1111111111",
//   }
// })
export const getInfo = async () => {
  // const [ctx, setCtx] = useCtx()
  // let res = await orderService.getOrders()
  // const context = useContext()
  // console.log(context.url, 292929929)
  return {
    data: "这是 getInfo 函数的返回结果",
    msg: "OK1111111111",
  }
}

export const createOrder = async (info) => {
  return {
    data: info,
    msg: "创建成功",
  }
}
// export const updateOrder = async () => {}
// export const deleteOrder = async () => {}

export default () => {
  console.log("export default")
  return "default"
}
