// export * as DBService from "./db"
// export * as BusinessService from "./business"
// export * as UtilService from "./util"

import connect, { getOrders, getBuffets } from "./db"
// await connect("mongodb://47.243.178.42/canteenDev")

export const orderService = {
  getOrders: async () => {
    let resdb = await getBuffets()
    console.log(resdb, 123123)
    return resdb
  },
}
