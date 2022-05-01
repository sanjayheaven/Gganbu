import mongoose, { Model } from "mongoose"
import pluralize from "pluralize"

export const createBasicActions = (model: typeof Model) => {
  let name = model.modelName
  let namePluralize = pluralize(name.toLowerCase())
  let schema = model.schema
  let create = `create${model.modelName}`
  let res = {
    [create]: async (data: object) => {
      return model.create(data)
    },
    create: async (data: object) => {
      return model.create(data)
    },
    delete: async ({ _id }) => {
      return model.deleteOne({ _id })
    },
    update: async ({ _id, ...data }) => {
      return model.updateOne({ _id }, { $set: { ...data } })
    },
    getMany: async ({
      skip = 0,
      limit = 10,
      filters = {},
      sort = { _id: -1 },
    }) => {
      let totalCount = model.countDocuments(filters)
      let items = model.aggregate([
        { $match: filters },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
      ])
      return { totalCount, items }
    },
    getOne: async ({ _id }) => {
      return model.findById({ _id })
    },
  }
  return res
}
