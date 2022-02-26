import { Context } from "koa"
import { ServiceAction } from "../../types/service"
// extends type Service

export { Context } from "koa"

export interface Controller {
  serviceFilePath: string
  serviceFileName: string
  exports: Object
}

export interface Route {
  path: string
  method: string
  actionName: string
  serviceFilePath: string
  serviceFileName: string
  serviceAction: ServiceAction
  controllerAction: ControllerAction
  middlewares?: [] // 文件级别中间件
}

export interface ControllerAction {
  (ctx: Context): any
}

/**
 * framework config
 */
export interface FrameworkConfig {
  port: Number
  routerPrefix?: String
  middlewares?: []
}
