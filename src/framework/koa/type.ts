import { Context } from "koa"

import { ServiceAction } from "../../service/type"
// extends type Service

export { Context } from "koa"

export interface Controller {
  serviceFilePath: string
  serviceFileName: string
  exports: Object
}

interface ControllerAction {
  (ctx: Context): any
}

type HttpMethod = "GET" | "POST"

export interface Route {
  path: string
  routerPrefix: string
  method: HttpMethod
  serviceAction: ServiceAction
  controllerAction: ControllerAction
  middlewares?: [] // 文件级别中间件
}

/**
 * framework config
 */
export interface FrameworkConfig {
  port: Number
  // routerPrefix?: String  // 1.2.x 去除
  middlewares?: []
}
