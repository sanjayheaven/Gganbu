import Koa from "Koa"
import KoaRouter from "koa-router"
import KoaCompose from "koa-compose"
import GlobalDefaultMiddlewares from "./middlewares"
import { convertFileToRoute, isFn } from "../../utils"
import { ServiceAction } from "../../types/service"
import {
  Context,
  Controller,
  ControllerAction,
  FrameworkConfig,
  Route,
} from "./type"
import { getServices } from "../../service"
import { join } from "upath"
import { FrameworkPlugin } from "../../types/plugin"
import pluralize from "pluralize"

const defaultConfig: FrameworkConfig = {
  routerPrefix: "/api",
  port: 3000,
}

const getControllers = (): Controller[] => {
  let services = getServices()
  return services.map((i) => {
    let { exports = {}, filePath, fileName } = i
    Object.keys(exports).forEach((i) => !isFn(exports[i]) && delete exports[i])
    return {
      serviceFileName: fileName,
      serviceFilePath: filePath,
      exports: Object.keys(exports).reduce((acc, key) => {
        let serviceAction: ServiceAction = exports[key]
        // 每一种web server框架，都会有相应的request response 输出
        let controllerAction: ControllerAction = async (ctx: Context) => {
          if (key.startsWith("get")) {
            let query = ctx.request.query
            let res = await serviceAction(query)
            ctx.body = res
          } else {
            let body = ctx.request.body // bodyparser 解析出来的
            let res = await serviceAction(body)
            ctx.body = res
          }
        }
        return { ...acc, [key]: controllerAction, serviceAction }
      }, {}),
    }
  })
}

const getRoutes = () => {
  let controllers = getControllers()
  return controllers.reduce((acc: Route[], controller: Controller) => {
    let { exports = {}, serviceFilePath, serviceFileName } = controller
    Object.keys(exports).forEach((i) => !isFn(exports[i]) && delete exports[i])
    let routes = Object.keys(exports)
      .filter((key) => key != "default")
      .map((key) => {
        return {
          path: "/" + key,
          method: (key.startsWith("get") && "GET") || "POST",
          actionName: key,
          serviceFilePath,
          serviceFileName,
          controllerAction: exports[key],
        }
      })
    return [...acc, ...routes]
  }, [])
}

const getRouters = (config?: FrameworkConfig): KoaRouter.IMiddleware[] => {
  let { routerPrefix } = { ...defaultConfig, ...(config || {}) }
  let routes = getRoutes()
  let res = routes.reduce((acc: KoaRouter.IMiddleware[], route: Route) => {
    let { controllerAction, serviceFilePath, method, serviceAction } = route

    let name = convertFileToRoute(serviceFilePath)
    let router = new KoaRouter({
      prefix: join(routerPrefix, pluralize(name)),
    })
    let routeMiddlewares = serviceAction?.config?.middlewares || []
    if (method == "GET") {
      router.get(route.path, ...routeMiddlewares, controllerAction)
    } else {
      router.post(route.path, ...routeMiddlewares, controllerAction)
    }
    acc.push(router.routes())
    acc.push(router.allowedMethods())
    return acc
  }, [])
  return res
}

const start = async (config?: FrameworkConfig) => {
  const App = new Koa()
  let { port, middlewares = [] } = config || defaultConfig
  // load router
  const routers = getRouters(config || defaultConfig)
  // load middlewares,
  App.use(KoaCompose([...middlewares, ...GlobalDefaultMiddlewares, ...routers]))
  //   start
  let server = App.listen(port, () => {
    console.log(`👻  :Server listening at port: ${port} `)
  })
  // pm2 平滑更新
  process.on("SIGINT", () => {
    server.keepAliveTimeout = 1
    server.close(() => {
      process.exit(0)
    })
  })
}

let configuration: FrameworkConfig = defaultConfig
export const Framework: FrameworkPlugin = {
  async start() {
    return start(configuration)
  },
  setConfig(config: FrameworkConfig) {
    configuration = config
    return this
  },
}
