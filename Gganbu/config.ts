import { resolve } from "upath"
import { ProjectConfig, ServerConfig } from "./types/config"
import { existFile, getProjectRoot, importFileDefault } from "./util"

/**
 * 默认配置
 */
const defaultConfig: ProjectConfig = {
  controllerDir: "./src/controllers", // 后端的controller地址
  routerPrefix: "/api",
}
/**
 * 找到 整个 gganbu.config.js/ts 文件
 */
export const getProjectConfig = (): ProjectConfig => {
  const root = getProjectRoot()
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
  let controllerDir = "./src/api"
  let configJs = resolve(root, controllerDir, "configuration.js")
  let configTs = resolve(root, controllerDir, "configuration.ts")
  let configFilePath =
    (existFile(configJs) && configJs) || (existFile(configTs) && configTs) || ""
  if (!configFilePath) return {}
  return importFileDefault(configFilePath)
}

/**
 * 根据项目配置，获取controllerDir
 */
export const getControllerDir = () => {
  let projectConfig = getProjectConfig()
  return projectConfig.controllerDir
}

/**
 * 根据项目配置，resolve root，controllerDir
 */
export const getResolvedControllerDir = () => {
  let root = getProjectRoot()
  let { controllerDir } = getProjectConfig()
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
 * 自定义项目配置
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
