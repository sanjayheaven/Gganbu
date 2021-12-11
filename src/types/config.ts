/**
 * project config
 */
export interface ProjectConfig {
  controllerDir?: string
  routerPrefix?: string
  build?: {
    outDir?: string
  },
  // server relative
  middlewares?: any[] // global middleware
  port?: number // server port
}
