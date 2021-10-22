
    const {model:OrderModel} = require('../models/order')
    module.exports = {
        
    createOrder: async (data) => {
      return OrderModel.create(data)
    },
    deleteOrder: async ({ orderId }) => {
      return OrderModel.deleteOneById({ _id: orderId })
    },
    updateOrder: async ({ orderId, ...data }) => {
      return OrderModel.update({ _id: orderId }, { $set: { ...data } })
    },
    getOrders: async ({ orderId, ...data }) => {
      return OrderModel.update({ _id: orderId }, { $set: { ...data } })
    },
    getOrder: async ({ orderId }) => {
      return OrderModel.findOneById({ _id: orderId })
    },
  
    }
    