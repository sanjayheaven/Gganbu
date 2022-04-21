/**
 * Service 服务
 */
export interface Service {
  filePath: string
  fileName: string
  exports?: object // export的集合 可以是函数 可以是default 可是配置config
}
/**
 * service actions, only accept an Object type arg
 */
export interface ServiceAction {
  (arg?: object): any
  config?: {
    middlewares?: any[] // 判断是否有中间件，有就先组合
  }
}
