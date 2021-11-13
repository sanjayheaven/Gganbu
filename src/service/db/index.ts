import mongoose, { connect } from "mongoose"
import axios from "axios"
export default async (dbAddress) => {
  console.log("调用链接,", mongoose)
  return new Promise((resolve, reject) => {
    // mongoose.Promise = Promise
    mongoose.connect(dbAddress, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })

    mongoose.connection.on("connected", () => {
      resolve(`🍟  :Successfully connected to MongoDB at ${dbAddress}`)
      console.log("mongodb数据库连接成功")
    })
    mongoose.connection.on("error", (error) => {
      reject(
        `⚠️  :Connected failed, please check your MongoDB with ${dbAddress}`
      )
      console.log("mongodb数据库连接失败", error)
    })
  })
}

export const getOrders = async () => {
  //   return await orderModel.find()
  return []
}
export const getBuffets = async () => {
  let res = await axios({
    url: "https://test.onlinefood.sg/pos/api/v1/buffets?canteenId=616e29a7c6cda10012549d52",
    method: "GET",
  })
  console.log(res, 1111)
  return res.data
}
