// 订单相关页面

import { useContext } from "../../../Gganbu/hook"
import { wrapController } from "../../../Gganbu/middleware"

// const loadMiddleware = (middlewares, func) => {
//   await compose([...middlewares, mafunc])
// }
const logger = async (ctx, next) => {
  const start = Date.now()
  console.log("日志开始", ctx.request.body)
  await next()
  const cost = Date.now() - start
  console.log(`request ${ctx.url} cost ${cost}ms`)
}

export const getInfo = async (data, data1?: any) => {
  return {
    data: data,
    msg: "test1223",
  }
}
getInfo.config = { middlewares: [logger] }

export const createOrder = async (name: string) => {
  return {
    data: name,
    msg: "测试一样更新",
  }
}
// // export const updateOrder = async () => {}
// // export const deleteOrder = async () => {}

export default () => {
  console.log("export default")
  return "default"
}
