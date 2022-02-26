import { join, resolve } from "upath"
import { ProjectConfig } from "../types/config"
import { existFile, getProjectRoot, importFileDefault } from "../utils"

export const getProjectConfigPre = (): ProjectConfig => {
  const root = getProjectRoot()
  let jsFile = resolve(root, "gganbu.config.js")
  let tsFile = resolve(root, "gganbu.config.ts")
  let filePath = (existFile(jsFile) && jsFile) || (existFile(tsFile) && tsFile)
  let config = importFileDefault(filePath) || {}
  return { ...defaultConfig, ...config }
}
export const wrappedProjectConfig = {
  // 用于cli 重载getConfig方法
  getConfig: (): ProjectConfig => {
    return getProjectConfigPre()
  },
}
export const getProjectConfig = () => {
  return wrappedProjectConfig.getConfig()
}

export const getResolvedServiceDir = () => {
  const root = getProjectRoot()
  return resolve(root, "./services")
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
 * 默认项目配置
 */
const defaultConfig: ProjectConfig = {
  controllerDir: "/src/controllers", // 后端的controller地址
  routerPrefix: "/api",
  port: 3303,
}
