const path = require("path")
const fs = require("fs")
const KoaRouter = require("koa-router")
const { routerPrefix } = require("../config/config.router.js")
const pluralize = require("pluralize") // 单词复数

// fs 读取目录 是按照顺寻的吗?

const listFiles = (filePath) => {
  let stat = fs.lstatSync(filePath)
  if (!stat.isDirectory()) return []
  let files = fs.readdirSync(filePath)
  let res = files.map((file) => {
    return {
      path: path.resolve(filePath, file),
      fileName: file,
    }
  })
  return res
}

let routeDirPath = path.resolve(__dirname)
let apps = listFiles(routeDirPath)
let routeFiles = apps.reduce((acc, app) => {
  let files = listFiles(app.path).map((file) => {
    return { ...file, app: app.fileName }
  })
  return [...acc, ...files]
}, [])

let routes = routeFiles.reduce((acc, file) => {
  let { path: filePath, fileName, app } = file
  let fileRoutes = require(filePath)
  let name = fileName.substring(0, fileName.indexOf("."))
  let prefix = routerPrefix + `${app}/${pluralize(name)}`
  let router = new KoaRouter({ prefix })
  let controllerPath = path.resolve(
    __dirname,
    `../controllers/${app}/${fileName}`
  )
  let Controller = require(controllerPath)
  fileRoutes.forEach((route) => {
    route.method = (route.method || "get").toLowerCase()
    let action = route.path.slice(1)
    if (route.method == "get") {
      router.get(route.path, Controller[action])
    } else {
      router.post(route.path, Controller[action])
    }
    acc.push(router.routes())
    acc.push(router.allowedMethods())
  })
  return acc
}, [])

module.exports = routes
