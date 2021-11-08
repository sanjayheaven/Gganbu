const { model: OrderModel } = require("../models/order")
module.exports = {
  createOrder: async (data) => {
    return OrderModel.create(data)
  },
  deleteOrder: async ({ orderId }) => {
    return OrderModel.deleteOne({ _id: orderId })
  },
  updateOrder: async ({ orderId, ...data }) => {
    return OrderModel.update({ _id: orderId }, { $set: { ...data } })
  },
  getOrders: async ({
    skip = 0,
    limit = 10,
    filters = {},
    sort = { _id: -1 },
  }) => {
    let totalCount = OrderModel.countDocuments(filters)
    let items = OrderModel.aggerate([
      { $match: filters },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    ])
    return { totalCount, items }
  },
  getOrder: async ({ orderId }) => {
    return OrderModel.findOneById({ _id: orderId })
  },
}
