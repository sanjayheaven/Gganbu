import middleware from "@/middleware"
import KoaCompose from "koa-compose"
import { getServerConfig } from "./config"
import { ControllerAction } from "./types/model"
/**
 * 路由中间件 routeMiddlewares
 * 给接口增加 属性 routeMiddlewares
 */

export const wrapController = (config, controllerAction: ControllerAction) => {
  let { middlewares = [] } = config
  controllerAction.routeMiddlewares = [
    ...middlewares,
    ...(controllerAction.routeMiddlewares || []),
  ]
  return controllerAction
}

/**
 * 文件中间件 fileMiddlewares
 *
 */

// 在路由解析中，对 exports['config'] 中的 middlewares 即为 fileMiddlewares

/**
 * 全局中间件
 */
export const getGlobalMiddlewares = () => {
  let { middlewares = [] } = getServerConfig()
  return middlewares
}
