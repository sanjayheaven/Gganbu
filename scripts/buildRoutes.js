const fs = require("fs")
const path = require("path")
const pluralize = require("pluralize") // 单词复数

const createRoute = (app, file, controller) => {
  let keys = Object.keys(controller)
  let routes = keys.map((key) => {
    let method = (key.startsWith("get") && "GET") || "POST"
    return `{path:"/${key}",method:"${method}"}`
  })
  return `
    const routes = [${routes.join(",\n")}]
    module.exports = routes
    `
}

const main = () => {
  let controllerPath = path.resolve(__dirname, "../controllers")
  let apps = fs.readdirSync(controllerPath)
  apps.forEach((app) => {
    let appPath = path.resolve(__dirname, `../controllers/${app}`)
    let files = fs.readdirSync(appPath)
    fs.mkdir(path.resolve(__dirname, `../routes`), () => {})
    files.forEach((file) => {
      let filePath = path.resolve(__dirname, `../controllers/${app}/`, file)
      let controller = require(filePath)
      let basicPath = path.resolve(__dirname, `../routes/${app}/`, file)
      fs.mkdir(path.resolve(__dirname, `../routes/${app}`), () => {})
      fs.writeFileSync(basicPath, (app, file, controller))
      file = file.substring(0, file.indexOf("."))
    }, {})
  })
}

main()
