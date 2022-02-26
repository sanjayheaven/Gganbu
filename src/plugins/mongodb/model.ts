import mongoose, { Schema, SchemaDefinitionProperty } from "mongoose"
import path from "path"
import { firstAlphaToUpperCase } from "../../util"

export const createSchema = (obj: SchemaDefinitionProperty) => {
  return new Schema(obj)
}

export const createModel = (module: NodeModule, schema: Schema) => {
  let fileName = path.parse(module.filename).name
  let name = firstAlphaToUpperCase(fileName)
  return mongoose.model(name, schema)
}

export const ObjectId = Schema.Types.ObjectId
