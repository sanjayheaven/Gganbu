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
  getProjectRoot,
  isFn,
  proxyController,
} from "./util"
import { join, resolve } from "upath"
import { getProjectConfig } from "./config"
import { Route, Controller } from "./types/model"
import { getGlobalMiddlewares, withController } from "./middleware"

export const getControllers = (): Controller[] => {
  const projectRoot = getProjectRoot()
  const { controllerDirname } = getProjectConfig()
  let controllerPath = resolve(projectRoot, controllerDirname)
  let files = listFiles(controllerPath)
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
    let routes = Object.keys(exports).map((key) => {
      return {
        path: "/" + key,
        method: (key.startsWith("get") && "GET") || "POST",
        fileMiddlewares: middlewares, // 文件的配置路由信息
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
    let { controllerPath, controllerAction, fileMiddlewares } = route
    let name = convertFileToRoute(controllerPath)
    let router = new KoaRouter({ prefix: join(routerPrefix, name) })
    let wrappedAction = withController({ middlewares: [] }, controllerAction)
    let routeMiddlewares = wrappedAction.routeMiddlewares || []
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
  let middlewares = getGlobalMiddlewares()

  App.use(KoaCompose([...middlewares, ...routers]))

  // 启动
  if (!server) {
    server = App.listen(7006, () =>
      console.log(`项目启动, 端口：${7006}, 环境：${process.env.NODE_ENV}`)
    )
  }

  // pm2 平滑更新
  process.on("SIGINT", () => {
    server.keepAliveTimeout = 1
    server.close(() => {
      process.exit(0)
    })
  })
}
export const AppRestart = async () => {
  await server.close(async () => {
    console.log("server，成功关闭")
    server = null
    await AppStart()
  })
}

export const AppClose = async () => {
  if (server) {
    await server.close(() => {
      server = null
    })
  }
}
// app 启动
// 加载中间件
//
