/**
 * 如果这个作为一个 npm库 那导入 let {Controller} =  require('Gganbu')
 * 怎么能确保在任何地方导入 都能读取到 指定Controller、
 */
const path = require("path")
const fs = require("fs")
const pluralize = require("pluralize")

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

/**
 * 返回结果：[Object]
 * {
 *  path
 *  fileName
 *  app
 *  actions:{}
 * }
 */
const getControllers = () => {
  let controllerPath = path.resolve(__dirname, "../controllers")
  let apps = listFiles(controllerPath)
  //   console.log(apps)
  return apps.reduce((acc, app) => {
    let files = listFiles(app.path)
    acc = [
      ...acc,
      ...files.map((file) => {
        let acitonsObj = require(file.path)
        return {
          ...file,
          app: app.fileName, // 增加应用标识
          actions: acitonsObj,
        }
      }),
    ]
    return acc
  }, [])
}

const getRoutes = (controllers) => {
  return controllers.reduce((acc, controller) => {
    let { actions } = controller
    let routes = Object.keys(actions).map((key) => {
      return {
        app: controller.app,
        path: "/" + key,
        method: (key.startsWith("get") && "GET") || "POST",
        middlewares: [],
        action: key,
        fileName: controller.fileName,
        controllerPath: controller.path,
      }
    })
    acc = [...acc, ...routes]
    return acc
  }, [])
}

const KoaRouter = require("koa-router")
const { routerPrefix } = require("../config/config.router.js")

const getRouter = (routes) => {
  return routes.reduce((acc, route) => {
    let { app, fileName } = route
    let name = fileName.substring(0, fileName.indexOf(".")) // 去除js后缀
    let prefix = routerPrefix + `${app}/${pluralize(name)}`

    let router = new KoaRouter({ prefix })
    let controller = require(route.controllerPath)

    if (route.method == "GET") {
      router.get(route.path, controller[route.action])
    } else {
      router.post(route.path, controller[route.action])
    }
    acc.push(router.routes())
    acc.push(router.allowedMethods())

    return acc
  }, [])
}

const Controller = getControllers()
const Routes = getRoutes(Controller)
const Router = getRouter(Routes)

console.log(Controller, Routes, Router)

module.exports = {
  Controller,
  Routes,
  Router: [], // runtime Router
  Api: {}, // api 是给前端调用的，会在编译的时候，自动转化成
}
