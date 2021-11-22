import { join } from "upath"
import { ProjectConfig } from "./types/config"
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
  let configJs = join(root, "gganbu.config.js")
  let configTs = join(root, "gganbu.config.ts")
  let configFilePath =
    (existFile(configJs) && configJs) || (existFile(configTs) && configTs) || ""
  if (!configFilePath) return defaultConfig
  let userConfig = importFileDefault(configFilePath)
  return userConfig
}

/**
 * 自定义配置
 */
export const defineConfig = (config: ProjectConfig) => {
  return config
}
