// 订单相关页面

export const getInfo = (ctx) => {
  // const [ctx, setCtx] = useCtx()
  // const context = useContext()
  // const context = useContext()
  return "你好 getInfo"
}
export const createOrder = async (info) => {
  return {
    data: info,
    msg: "创建成功",
  }
}
export const updateOrder = async () => {}
export const deleteOrder = async () => {}
