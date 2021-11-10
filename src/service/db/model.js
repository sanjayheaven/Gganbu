import mongoose from "mongoose"

const schema = {
  number: String,
  createTime: Date,
  status: String,
  goods: [
    {
      name_cn: String,
      name_en: String,
      price: Number,
      quantity: Number,
    },
  ],
}

export const orderModel = mongoose.model("Order", mongoose.Schema(schema))
