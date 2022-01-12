/**
 * project config
 */
 export interface ProjectConfig {
  controllerDir?: string
  routerPrefix?: string
  build?: {
    outDir?: string
  }
  baseURL?: string
  // server relative
  middlewares?: any[] // global middleware
  port?: number // server port
}
