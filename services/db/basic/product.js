const { model: ProductModel } = require("../models/product")
module.exports = {
  createProduct: async (data) => {
    return ProductModel.create(data)
  },
  deleteProduct: async ({ productId }) => {
    return ProductModel.deleteOne({ _id: productId })
  },
  updateProduct: async ({ productId, ...data }) => {
    return ProductModel.update({ _id: productId }, { $set: { ...data } })
  },
  getProducts: async ({
    skip = 0,
    limit = 10,
    filters = {},
    sort = { _id: -1 },
  }) => {
    let totalCount = ProductModel.countDocuments(filters)
    let items = ProductModel.aggerate([
      { $match: filters },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    ])
    return { totalCount, items }
  },
  getProduct: async ({ productId }) => {
    return ProductModel.findOneById({ _id: productId })
  },
}
