// 订单相关页面
// import { orderService } from "../../service"
export const getInfo = async () => {
  // const [ctx, setCtx] = useCtx()
  // const context = useContext()
  // let res = await orderService.getOrders()
  // const context = useContext()
  return "getInfo"
}
export const createOrder = async (info) => {
  return {
    data: info,
    msg: "创建成功",
  }
}
export const updateOrder = async () => {}
export const deleteOrder = async () => {}

export default () => {
  console.log("export default")
}
