// 订单相关页面

const { als, useContext } = require("../../../Gganbu/hook")
module.exports = {
  getInfo: async (ctx) => {
    // const [ctx, setCtx] = useCtx()
    const context = useContext()
    console.log(ctx, 2222)

    return "你好 getInfo"
  },
  createOrder: async (info) => {
    console.log(2222)
    return {
      data: info,
      msg: "创建成功",
    }
  },
  updateOrder: async () => {},
  deleteOrder: async () => {},
}
