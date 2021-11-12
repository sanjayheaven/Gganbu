/**
 * 如果这个作为一个 npm库 那导入 let {Controller} =  require('Gganbu')
 * 怎么能确保在任何地方导入 都能读取到 指定Controller、
 */
import path from "path"
import fs from "fs"
import pluralize from "pluralize"
import Koa from "Koa"
import { listFiles, convertFileToRoute } from "./util"
import { init, parse } from "es-module-lexer"
import { join } from "upath"
/**
 * 返回结果：[Object]
 * {
 *  path
 *  fileName
 *  app
 *  actions:{}
 * }
 */

/**
 *  mapFnToCtxAction
 *  将 controller 当中的普通函数 转换成 带有请求上下文的
 *  约定好，返回值，即是，请求上下问返回体
 */
const getSrcDirname = () => {
  let fileDirName = process.cwd()
  let index = fileDirName.indexOf("src")
  return (
    (index !== -1 && fileDirName.substring(0, index + 3)) ||
    path.resolve(fileDirName, "src")
  )
}
const getControllers = () => {
  let srcDirname = getSrcDirname()
  let controllerPath = path.resolve(srcDirname, "controller")
  let files = listFiles(controllerPath)
  return files.map((file) => {
    // 会把controller 第一个目录下的目录名称作为 应用名称
    return {
      ...file,
      actions: require(file.filePath),
    }
  })
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
        controllerPath: controller.filePath,
      }
    })
    acc = [...acc, ...routes]
    return acc
  }, [])
}

const KoaRouter = require("koa-router")
// const { routerPrefix } = require("../config/config.router.js")

const createRouter = (routes) => {
  return routes.reduce((acc, route) => {
    let { app, fileName, controllerPath } = route
    let name = convertFileToRoute(controllerPath)
    let prefix = join(routerPrefix, name)
    let router = new KoaRouter({ prefix })
    let controller = require(route.controllerPath)
    let ctyMap = function (action) {
      return function (ctx) {
        let res = action()
        ctx.body = res
      }
    }
    if (route.method == "GET") {
      router.get(route.path, ctyMap(controller[route.action]))
    } else {
      router.post(route.path, controller[route.action])
    }
    console.log(router)
    acc.push(router.routes())
    acc.push(router.allowedMethods())
    return acc
  }, [])
}

const createApi = (controllers) => {
  return controllers.reduce((acc, controller) => {
    let { app, fileName, actions } = controller
    let name = fileName.substring(0, fileName.indexOf("."))
    acc[app] = {
      ...acc[app],
      [`${name}Api`]: {
        // path: `/api/v1/${app}/${pluralize(name)}`,
        ...actions,
      },
    }
    return acc
  }, {})
}

export const Controller = getControllers()
console.log(Controller, 111)
// export const Route = getRoutes(Controller)
// export const Api = createApi(Controller)
// export const Router = createRouter(Route)
// export const App = new Koa()
