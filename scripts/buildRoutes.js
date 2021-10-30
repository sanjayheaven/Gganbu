const fs = require("fs")
const path = require("path")
const pluralize = require("pluralize") // 单词复数

const createRoute = (app, file, controller) => {
  let keys = Object.keys(controller)
  let routes = keys.map((key) => {
    let method = (key.startsWith("get") && "get") || "post"
    return `router.${method}('/${key}',Controllers.${key})`
  })
  return `
    const Router = require("koa-router")
    const { routerPrefix } = require("../../config/config.router.js")
    const router = new Router({prefix:routerPrefix+"/${pluralize(file)}" }) 
    const Controllers = require("../../controllers/${app}/${file}")
    ${routes.join("\n")}
    module.exports = [router]
    `
}

const main = () => {
  let controllerPath = path.resolve(__dirname, "../controllers")
  let apps = fs.readdirSync(controllerPath)
  console.log(apps, 11111)
  apps.forEach((app) => {
    let appPath = path.resolve(__dirname, `../controllers/${app}`)
    let files = fs.readdirSync(appPath)
    fs.mkdir(path.resolve(__dirname, `../routes`), () => {})
    files.forEach((file) => {
      let filePath = path.resolve(__dirname, `../controllers/${app}/`, file)
      let controller = require(filePath)
      let basicPath = path.resolve(__dirname, `../routes/${app}/`, file)
      fs.mkdir(path.resolve(__dirname, `../routes/${app}`), () => {})
      fs.writeFileSync(basicPath, createRoute(app, file, controller))
      file = file.substring(0, file.indexOf("."))
    }, {})
  })
}

main()
