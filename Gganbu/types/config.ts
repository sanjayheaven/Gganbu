/**
 * 项目开发配置
 */
export interface ProjectConfig {
  controllerDir?: string
  routerPrefix?: string
  build?: {
    outDir?: string
  }
}

/**
 * server 的配置
 */
export interface ServerConfig {
  middlewares?: any[] // 全局中间件
  port?: number // server 启动端口
  routerPrefix?: string // 全局的路由前缀
}
