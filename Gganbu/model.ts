/**
 * 如果这个作为一个 npm库 那导入 let {Controller} =  require('Gganbu')
 * 怎么能确保在任何地方导入 都能读取到 指定Controller、
 */
import Koa from "Koa"
import koaCompose from "koa-compose"
import KoaRouter from "koa-router"
import { listFiles, convertFileToRoute, mapReturnToCtxBody } from "./util"
import path, { join, resolve } from "upath"
import { als, useContext } from "./hook"
import fs from "fs"
import createJITI from "jiti"

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
    resolve(fileDirName, "src")
  )
}

/**
 * 动态引入文件
 */
export const importAction = async (filePath) => {
  // 如果是目录，那就查询 index.ts 文件
  // 如果是文件，那就查询文件
  // return import(filePath)
  const jiti = createJITI()
  const contents = jiti(filePath)
  if (contents.default) return contents.default
  return contents
}
export const getControllers = () => {
  let srcDirname = getSrcDirname()
  let controllerPath = resolve(srcDirname, "controller")
  let files = listFiles(controllerPath)
  return files.map((file) => {
    return { ...file }
  })
}

export const getRoutes = async (controllers) => {
  return controllers.reduce(async (acc, controller) => {
    let { fileName, filePath } = controller
    let actionObj = await importAction(filePath)
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
  const Route = await getRoutes(Controller)
  return getRouter(Route)
}

export const App = new Koa()

export const Middleware = [] // 包括 als中间 全局中间件 路由中间件

export const getMiddlerware = async () => {
  let srcDirname = getSrcDirname()
  let middlewarePath = join("file://", srcDirname, "middleware")
  console.log(srcDirname, 1919200000, middlewarePath)
  return await importAction(middlewarePath)
}

export const getMiddlerwareFromES = async () => {
  let srcDirname = getSrcDirname()
  let middlewarePath = join("./src/", "middleware")
  return await importAction("../src/middleware/index.ts")
}

export const AppStart = async () => {
  const ALSMiddleware = async (ctx, next) => {
    await als.run({ ctx: ctx }, async () => {})
    await next()
  }
  const Router = await createRouter()
  const Middleware = await getMiddlerware()
  console.log(Controller, Router, Middleware)

  App.use(koaCompose([ALSMiddleware, ...Middleware, ...Router]))

  // 启动
  const server = App.listen(7006, () =>
    console.log(`项目启动, 端口：${7006}, 环境：${process.env.NODE_ENV}`)
  )

  // pm2 平滑更新
  process.on("SIGINT", () => {
    server.keepAliveTimeout = 1
    server.close(() => {
      process.exit(0)
    })
  })
}
// app 启动
// 加载中间件
//
