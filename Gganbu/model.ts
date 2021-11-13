/**
 * 如果这个作为一个 npm库 那导入 let {Controller} =  require('Gganbu')
 * 怎么能确保在任何地方导入 都能读取到 指定Controller、
 */
import path from "path"
import Koa from "Koa"
import KoaRouter from "koa-router"
import { listFiles, convertFileToRoute, mapReturnToCtxBody } from "./util"
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
export const importAction = (filePath) => {
  return () => import(filePath)
}
export const getControllers = () => {
  let srcDirname = getSrcDirname()
  let controllerPath = path.resolve(srcDirname, "controller")
  let files = listFiles(controllerPath)
  return files.map((file) => {
    return {
      ...file,
      importActionObj: importAction(file.filePath),
    }
  })
}

export const getRoutes = async (controllers) => {
  return controllers.reduce(async (acc, controller) => {
    let { importActionObj, fileName, filePath } = controller
    let actionObj = await importActionObj()
    let routes = Object.keys(actionObj).map((key) => {
      return {
        path: "/" + key,
        method: (key.startsWith("get") && "GET") || "POST",
        middlewares: [],
        fileName: fileName,
        controllerPath: filePath,
        actionName: key,
        // action: actionObj[key],
        actionFn: actionObj[key],
      }
    })
    acc = [...acc, ...routes]
    return acc
  }, [])
}

// const { routerPrefix } = require("../config/config.router.js")

const routerPrefix = "/api"
export const getRouter = (routes) => {
  return routes.reduce((acc, route) => {
    let { fileName, controllerPath, actionFn } = route
    let name = convertFileToRoute(controllerPath)

    let prefix = join(routerPrefix, name)
    let router = new KoaRouter({ prefix })

    if (route.method == "GET") {
      router.get(route.path, mapReturnToCtxBody(actionFn))
    } else {
      router.post(route.path, mapReturnToCtxBody(actionFn))
    }
    acc.push(router.routes())
    acc.push(router.allowedMethods())
    return acc
  }, [])
}

export const Controller = getControllers()
export const createRouter = async () => {
  let Route = await getRoutes(Controller)
  return getRouter(Route)
}
export const App = new Koa()
