// 订单相关页面

import { useContext } from "../../../Gganbu/hook"

// import { orderService } from "../../service"
export const getInfo = async () => {
  // const [ctx, setCtx] = useCtx()
  // let res = await orderService.getOrders()
  // const context = useContext()
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

// export default () => {
//   console.log("export default")
// }
