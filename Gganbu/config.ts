import { join } from "upath"
import { existFile, getProjectRoot, importFileDefault } from "./util"

/**
 * 自定义配置
 */
export const defineConfig = (config: Object) => {
  return config
}

/**
 * 默认配置
 */
const defaultConfig = {
  source: "./src/controller", // 后端的controller地址
}
/**
 * 找到 整个 gganbu.config.js/ts 文件
 */
export const getConfig = (cwd?: string) => {
  const root = getProjectRoot(cwd)
  console.log(root)
  let configJs = join(root, "gganbu.config.js")
  let configTs = join(root, "gganbu.config.ts")
  let configFilePath =
    (existFile(configJs) && configJs) || (existFile(configTs) && configTs) || ""
  if (!configFilePath) return {}
  let userConfig = importFileDefault(configFilePath)
  return userConfig
}
let config = getConfig()
console.log(config, "用户配置")
