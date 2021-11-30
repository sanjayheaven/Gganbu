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
// // @loadMiddleware
export const getInfowrapController = wrapController(
  { middlewares: [logger] },
  async () => {
    return {
      data: "这是 getInfowrapController 函数的返回结果11111",
      msg: "OK111",
    }
  }
)

export const getInfo = async (data, data1?: any) => {
  let ctx = useContext()
  console.log(ctx.url, 101010)
  console.log(data, 22221)
  return {
    data: data,
    msg: "test1223",
  }
}

export const createOrder = async (name: string) => {
  console.log(name, "看看传入的参数")
  let ctx = useContext()
  console.log(ctx.url, 101010)
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
