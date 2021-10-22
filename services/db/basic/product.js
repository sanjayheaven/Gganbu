const { model: ProductModel } = require("../models/product")
module.exports = {
  createProduct: async (data) => {
    return ProductModel.create(data)
  },
  deleteProduct: async ({ productId }) => {
    return ProductModel.deleteOneById({ _id: productId })
  },
  updateProduct: async ({ productId, ...data }) => {
    return ProductModel.update({ _id: productId }, { $set: { ...data } })
  },
  getProducts: async ({ productId, ...data }) => {
    return ProductModel.update({ _id: productId }, { $set: { ...data } })
  },
  getProduct: async ({ productId }) => {
    return ProductModel.findOneById({ _id: productId })
  },
}
