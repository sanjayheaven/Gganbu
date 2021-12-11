import { join, resolve } from "upath"
import { ProjectConfig, } from "./types/config"
import { existFile, getProjectRoot, importFileDefault } from "./util"

/**
 * 默认项目配置
 */
const defaultConfig: ProjectConfig = {
  controllerDir: "/src/controllers", // 后端的controller地址
  routerPrefix: "/api",
}



export const getProjectConfigPre = (): ProjectConfig => {
  const root = getProjectRoot()
  let jsFile = resolve(root, "gganbu.config.js")
  let tsFile = resolve(root, "gganbu.config.ts")
  let filePath = (existFile(jsFile) && jsFile) || (existFile(tsFile) && tsFile)
  if (!filePath) return defaultConfig
  return importFileDefault(filePath)
}
export const wrappedProjectConfig = {
  getConfig: (): ProjectConfig => {
    return getProjectConfigPre()
  },
}
export const getProjectConfig = () => {
  return wrappedProjectConfig.getConfig()
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
 * 自定义项目配置
 */
export const defineConfig = (config: ProjectConfig) => {
  return config
}

