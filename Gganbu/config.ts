import { join, resolve } from "upath"
import { ProjectConfig, ServerConfig } from "./types/config"
import { existFile, getProjectRoot, importFileDefault } from "./util"

/**
 * 默认配置
 */
const defaultConfig: ProjectConfig = {
  controllerDirname: "./src/controller", // 后端的controller地址
  routerPrefix: "/api",
}
/**
 * 找到 整个 gganbu.config.js/ts 文件
 */
export const getProjectConfig = (cwd?: string): ProjectConfig => {
  const root = getProjectRoot(cwd)
  let configJs = resolve(root, "gganbu.config.js")
  let configTs = resolve(root, "gganbu.config.ts")
  let configFilePath =
    (existFile(configJs) && configJs) || (existFile(configTs) && configTs) || ""
  if (!configFilePath) return defaultConfig
  return importFileDefault(configFilePath)
}

/**
 * 找到 controller 目录下的 configuration文件
 */
export const getServerConfig = (): ServerConfig => {
  const root = getProjectRoot()
  let controllerDirname = "./src/api"
  let configJs = resolve(root, controllerDirname, "configuration.js")
  let configTs = resolve(root, controllerDirname, "configuration.ts")
  let configFilePath =
    (existFile(configJs) && configJs) || (existFile(configTs) && configTs) || ""
  if (!configFilePath) return {}
  return importFileDefault(configFilePath)
}

/**
 * 自定义配置
 */
export const defineConfig = (config: ProjectConfig) => {
  return config
}

/**
 * server的配置
 */
export const createConfiguraion = (config: ServerConfig) => {
  return config
}
