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
  importFile,
  isFn,
  proxyController,
} from "./util"
import { join } from "upath"
import {
  getProjectConfig,
  getResolvedControllerDir,
  getServerConfig,
} from "./config"
import { Route, Controller } from "./types/model"
import { getGlobalMiddlewares, wrapController } from "./middleware"
import { als } from "./hook"

export const getControllers = (): Controller[] => {
  let resolvedControllerDir = getResolvedControllerDir()
  let files = listFiles(resolvedControllerDir)
  files = files.filter((i) => i.filePath.indexOf("configuration") == -1)
  return files.map((file) => {
    return { ...file, exports: importFile(file.filePath) }
  })
}

export const getRoutes = (controllers: Controller[]): Route[] => {
  return controllers.reduce((acc, controller: Controller) => {
    let { fileName, filePath, exports } = controller
    let { middlewares = [] } = exports["config"] || {}
    Object.keys(exports).forEach((i) => !isFn(exports[i]) && delete exports[i])
    let routes = Object.keys(exports)
      .filter((key) => key != "default")
      .map((key) => {
        return {
          path: "/" + key,
          method: (key.startsWith("get") && "GET") || "POST",
          middlewares, // 文件的配置路由信息
          fileName: fileName,
          actionName: key,
          controllerPath: filePath,
          controllerAction: exports[key],
        }
      })
    /**针对 默认路由看看 必须排在最后一位 */
    if (exports["default"]) {
      routes.push({
        path: "/",
        method: "POST",
        middlewares, // 文件的配置路由信息
        fileName: fileName,
        actionName: "default",
        controllerPath: filePath,
        controllerAction: exports["default"],
      })
    }
    return [...acc, ...routes]
  }, [])
}

const getRouters = (routes: Route[]) => {
  let { routerPrefix } = getProjectConfig()
  return routes.reduce((acc, route: Route) => {
    let {
      controllerPath,
      controllerAction,
      middlewares: fileMiddlewares,
    } = route
    let name = convertFileToRoute(controllerPath)
    let router = new KoaRouter({ prefix: join(routerPrefix, name) })
    let wrappedAction = wrapController({}, controllerAction)

    let { middlewares: routeMiddlewares = [] } = wrappedAction.config || {}
    let proxy = proxyController(wrappedAction)
    if (route.method == "GET") {
      router.get(route.path, ...fileMiddlewares, ...routeMiddlewares, proxy)
    } else {
      router.post(route.path, ...fileMiddlewares, ...routeMiddlewares, proxy)
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
let server
export const AppStart = async () => {
  let { port } = getServerConfig()
  const routers = createRouter()
  App.use(async (ctx, next) => {
    await als.run({ ctx: ctx }, async () => {
      await next()
    })
  })

  // 加载全局中间件
  let middlewares = getGlobalMiddlewares()

  App.use(KoaCompose([...middlewares, ...routers]))

  // 启动
  if (!server) {
    server = App.listen(port, () => {})
  }

  // pm2 平滑更新
  process.on("SIGINT", () => {
    server.keepAliveTimeout = 1
    server.close(() => {
      process.exit(0)
    })
  })
}
