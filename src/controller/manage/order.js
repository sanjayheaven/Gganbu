// 订单相关页面
import { orderService } from "../../service"
export const getInfo = async (ctx) => {
  // const [ctx, setCtx] = useCtx()
  // const context = useContext()
  let res = await orderService.getOrders()
  // const context = useContext()
  return res
}
export const createOrder = async (info) => {
  return {
    data: info,
    msg: "创建成功",
  }
}
export const updateOrder = async () => {}
export const deleteOrder = async () => {}
