/**
 * 最终的项目开发配置
 */
export interface ProjectConfig {
  controllerDirname?: string
  routerPrefix?: string
}

/**
 * server 的配置
 */
export interface ServerConfig {
  middlewares?: any[]
}
