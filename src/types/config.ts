/**
 * project config
 */
export interface ProjectConfig {
  controllerDir?: string
  serviceDir?: string // 1.2.x 修改概念，面向服务，单个函数即服务
  routerPrefix?: string
  build?: {
    outDir?: string
  }
  baseURL?: string
  // server relative
  middlewares?: any[] // global middleware
  port?: number // server port
  plugins?: any[] // plugins
}
