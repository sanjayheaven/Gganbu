/**
 *
 */

enum HTTPMETHOD {
  GET = "GET",
  POST = "POST",
}

/**
 * Controller 控制器
 */
export interface Controller {
  filePath: string
  fileName: string
  exports?: object // export的集合 可以是函数 可以是default 可是配置config
}

/**
 * 根据 Controller 解析出来的 路由信息
 * action 必须是函数  因为存在 一些 config 和 middleware
 */
export interface Route {
  path?: string
  method?: HTTPMETHOD
  middlewares?: []
  fileName?: string // 文件名字
  actionName?: string
  controllerPath?: string
  controllerAction?: any
}
// type Middleware  = 