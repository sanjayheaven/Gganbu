import { RequestConfig } from "../request/type"

/**
 * project config
 */
export interface ProjectConfig {
  serviceDir?: string // 1.2.x 修改概念，面向服务，单个函数即服务
  routerPrefix?: string // 1.2.x 看看有没有必要
  port?: number // server port
  build?: {
    outDir?: string
  }
  baseURL?: string
  // server relative
  middlewares?: any[] // global middleware
  plugins?: any[] // plugins

  requestConfig?: RequestConfig // axios request config
}
