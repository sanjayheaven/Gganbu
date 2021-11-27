// 订单相关页面

import { useContext } from "../../../Gganbu/hook"
import { withController } from "../../../Gganbu/middleware"

// const loadMiddleware = (middlewares, func) => {
//   await compose([...middlewares, mafunc])
// }
const logger = async (ctx, next) => {
  const start = Date.now()
  console.log("日志开始", ctx.url)
  await next()
  const cost = Date.now() - start
  console.log(`request ${ctx.url} cost ${cost}ms`)
}
// // @loadMiddleware
export const getInfoWithController = withController(
  { middlewares: [logger] },
  async () => {
    return {
      data: "这是 getInfoWithController 函数的返回结果11111",
      msg: "OK111",
    }
  }
)
export const getInfo = async () => {
  return {
    data: "getIn11111",
    msg: "test1223",
  }
}

export const createOrder = async (info) => {
  return {
    data: info,
    msg: "测试一样更新33",
  }
}
// // export const updateOrder = async () => {}
// // export const deleteOrder = async () => {}

export default () => {
  console.log("export default")
  return "default"
}
