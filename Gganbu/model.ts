/**
 * 如果这个作为一个 npm库 那导入 let {Controller} =  require('Gganbu')
 * 怎么能确保在任何地方导入 都能读取到 指定Controller、
 */
import Koa from "Koa"
import KoaCompose from "koa-compose"
import KoaRouter from "koa-router"
import {
  listFiles,
  convertFileToRoute,
  mapReturnToCtxBody,
  importFile,
  getProjectRoot,
  isFn,
} from "./util"
import { join, resolve } from "upath"
import { als, useContext } from "./hook"
import { getProjectConfig, getServerConfig } from "./config"
import { Route, Controller } from "./types/model"
import { getGlobalMiddlewares, withController } from "./middleware"

export const getControllers = (): Controller[] => {
  const projectRoot = getProjectRoot()
  const { controllerDirname } = getProjectConfig()
  let controllerPath = resolve(projectRoot, controllerDirname)
  let files = listFiles(controllerPath)
  return files.map((file) => {
    return { ...file, exports: importFile(file.filePath) }
  })
}

export const getRoutes = (controllers: Controller[]): Route[] => {
  return controllers.reduce((acc, controller: Controller) => {
    let { fileName, filePath, exports } = controller
    let { middlewares = [] } = exports["config"] || {}
    Object.keys(exports).forEach((i) => !isFn(exports[i]) && delete exports[i])
    let routes = Object.keys(exports).map((key) => {
      return {
        path: "/" + key,
        method: (key.startsWith("get") && "GET") || "POST",
        middlewares: middlewares, // 文件的配置路由信息
        fileName: fileName,
        actionName: key,
        controllerPath: filePath,
        controllerAction: exports[key],
      }
    })
    return [...acc, ...routes]
  }, [])
}

const getRouters = (routes: Route[]) => {
  let { routerPrefix } = getProjectConfig()
  return routes.reduce((acc, route: Route) => {
    let { controllerPath, controllerAction, middlewares } = route
    let name = convertFileToRoute(controllerPath)
    let router = new KoaRouter({ prefix: join(routerPrefix, name) })
    let wrapMiddlewares = withController({ middlewares }, controllerAction)
    if (route.method == "GET") {
      router.get(route.path, mapReturnToCtxBody(controllerAction))
    } else {
      router.post(route.path, mapReturnToCtxBody(controllerAction))
    }
    acc.push(router.routes())
    acc.push(router.allowedMethods())
    return acc
  }, [])
}

export const createRouter = () => {
  let controllers = getControllers()
  let routes = getRoutes(controllers)
  return getRouters(routes)
}

export const App = new Koa()

export const AppStart = async () => {
  const routers = createRouter()
  // App.use(async (ctx, next) => {
  //   await als.run({ ctx: ctx }, async () => {
  //     let res = useContext()
  //     console.log(res && res.url, "在这之前的")
  //     await next()
  //     console.log(res && res.url, "返回的值得")
  //   })
  // })

  // 加载全局中间件
  let { middlewares = [] } = getServerConfig()
  console.log(middlewares, "全局中间件的设置", getServerConfig())
  // let globalMiddlewares = getGlobalMiddlewares()
  // console.log(globalMiddlewares, "全局中间件")
  App.use(KoaCompose([...middlewares, ...routers]))

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
