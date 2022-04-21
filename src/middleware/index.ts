import { getProjectConfig } from "../config"
import { ControllerAction } from "../types/model"

// 请求body 解析成对象
import bodyParser from "koa-bodyparser"
// 处理跨域
import cors from "koa2-cors"

/**
 * 路由中间件 routeMiddlewares
 * 给接口增加 属性 routeMiddlewares
 */

export const wrapController = (config, controllerAction: ControllerAction) => {
  controllerAction.config = {
    ...(controllerAction.config || {}),
    ...config,
  }
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
  let { middlewares = [] } = getProjectConfig()
  return [...middlewares, bodyParser(), cors()]
}


