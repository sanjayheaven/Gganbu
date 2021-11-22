import middleware from "@/middleware"
import KoaCompose from "koa-compose"
import { getServerConfig } from "./config"
import { mapReturnToCtxBody } from "./util"
/**
 * 单函数中间件 需要返回一个函数
 */
export const withController = (config, controllerAction) => {
  let { middlewares = [] } = config
  //   return KoaCompose(
  //     [...middlewares, controllerAction].map((i) => mapReturnToCtxBody(i))
  //   )
  return KoaCompose([...middlewares, mapReturnToCtxBody(controllerAction)])
}

/**
 * 全局中间件
 */
export const getGlobalMiddlewares = () => {
  let { middlewares = [] } = getServerConfig()
  console.log(middlewares, "看看中间件")
  return middlewares
}
