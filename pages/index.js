// 前端伪代码
/**
 * UI
 * 控制
 * await Api = {}
 */
const {
  Api,
  Api: { manage },
} = require("../Gganbu")

const { orderApi } = manage

const main = async () => {
  let res = await orderApi.getInfo()
  console.log(res, 111)
}
main()
