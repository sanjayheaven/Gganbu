const {
  Api,
  Api: { manage },
} = require("../../Gganbu")

const { orderApi } = manage

const main = async () => {
  let res = await orderApi.getInfo()
  let createInfo = await orderApi.createOrder({ name: 1, time: new Date() })
  console.log(res, 111, createInfo)
}
main()
