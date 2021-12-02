import { join, resolve } from "upath"
import { ProjectConfig, ServerConfig } from "./types/config"
import { existFile, getProjectRoot, importFileDefault } from "./util"

/**
 * 默认项目配置
 */
const defaultProjectConfig: ProjectConfig = {
  controllerDir: "/src/controllers", // 后端的controller地址
  routerPrefix: "/api",
}

/**
 * 默认服务端配置
 */
const defaultServerConfig: ServerConfig = {
  middlewares: [],
  port: 9527,
  routerPrefix: "/api",
}
/**
 * 找到 整个 gganbu.config.js/ts 文件
 */
export const getProjectConfig = (): ProjectConfig => {
  const root = getProjectRoot()
  let jsFile = resolve(root, "gganbu.config.js")
  let tsFile = resolve(root, "gganbu.config.ts")
  let filePath = (existFile(jsFile) && jsFile) || (existFile(tsFile) && tsFile)
  if (!filePath) return defaultProjectConfig
  return importFileDefault(filePath)
}

/**
 * 根据项目配置，获取controllerDir
 */
export const getControllerDir = () => {
  let { controllerDir } = getProjectConfig()
  return controllerDir
}

/**
 * 根据项目配置，resolve root，controllerDir
 */
export const getResolvedControllerDir = () => {
  let root = getProjectRoot()
  let controllerDir = getControllerDir()
  return resolve(root, controllerDir)
}

/**
 * 根据项目配置，resolve root，controllerDir
 */
export const getResolvedSrcDir = () => {
  let root = getProjectRoot()
  return resolve(root, "./src")
}

/**
 * 找到 controller 目录下的 configuration文件
 */
export const getServerConfigPre = (): ServerConfig => {
  let resolvedContrtollerDir = getResolvedControllerDir()
  let jsFile = resolve(resolvedContrtollerDir, "configuration.js")
  let tsFile = resolve(resolvedContrtollerDir, "configuration.ts")
  let filePath = (existFile(jsFile) && jsFile) || (existFile(tsFile) && tsFile)
  if (!filePath) return defaultServerConfig
  return importFileDefault(filePath)
}
export const wrappedServerConfig = {
  getConfig: (): ServerConfig => {
    return getServerConfigPre()
  },
}
export const getServerConfig = () => {
  return wrappedServerConfig.getConfig()
}

/**
 * 自定义项目配置
 */
export const defineProjectConfig = (config: ProjectConfig) => {
  return config
}

/**
 * server的配置
 */
export const defineServerConfig = (config: ServerConfig) => {
  return config
}
