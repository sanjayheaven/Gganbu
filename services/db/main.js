const fs = require("fs")
const path = require("path")
const pluralize = require("pluralize") // 单词复数

const createModels = ()=>{
    
}
const createContent = (actions) => {
  return Object.keys(actions)
    .map((key) => {
      return `${key}: ${actions[key]}`
    })
    .join(",")
}
let createFile = (Model, actions) => {
  let ModelName = Model + "Model"
  return `
    const {model:${ModelName}} = require('../models/${Model.toLowerCase()}')
    module.exports = {
        ${actions}
    }
    `
}
const createBasicActions = (Model) => {
  let ModelName = Model + "Model"
  let modelId = Model.toLowerCase() + "Id"
  return `
    create${Model}: async (data) => {
      return ${ModelName}.create(data)
    },
    delete${Model}: async ({ ${modelId} }) => {
      return ${ModelName}.deleteOne({ _id: ${modelId} })
    },
    update${Model}: async ({ ${modelId}, ...data }) => {
      return ${ModelName}.update({ _id: ${modelId} }, { $set: { ...data } })
    },
    get${pluralize(Model)}: async (
        {skip=0,limit=10,filters={},sort={_id:-1}}
        ) => {
      let totalCount = ${ModelName}.countDocuments(filters)
      let items  = ${ModelName}.aggerate([
          {$match:filters},
          {$sort:sort},
          {$skip:skip},
          {$limit:limit}
      ])
      return {totalCount,items}
    },
    get${Model}: async ({ ${modelId} }) => {
      return ${ModelName}.findOneById({ _id: ${modelId} })
    },
  `
}
const firstAlphaToUpperCase = (string) => {
  let [first, ...rest] = string
  return first.toUpperCase() + rest.join("")
}
const main = () => {
  let modelsPath = path.resolve(__dirname, "./models")
  let files = fs.readdirSync(modelsPath)
  files.forEach((file) => {
    // 首字母大写
    let ModelJs = firstAlphaToUpperCase(file)
    Model = ModelJs.substring(0, ModelJs.indexOf("."))

    let basicPath = path.resolve(__dirname, "./basic/", file)
    let actions = createBasicActions(Model)
    fs.writeFileSync(basicPath, createFile(Model, actions))

    // acc[model] = require(modelPath)
  }, {})
}

main()
