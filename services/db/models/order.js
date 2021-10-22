const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const currentFileName = ""

const schema = {
  number: String,
  createTime: Date,
  status: String,
  goods: [
    {
      productId: ObjectId,
      name_cn: String,
      name_en: String,
      price: Number,
      quantity: Number,
    },
  ],
}

module.exports = {
  model: mongoose.model("Order", mongoose.Schema(schema)),
  schema,
}
