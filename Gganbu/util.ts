import path, { extname, resolve, join, toUnix } from "upath"
import fs, { existsSync } from "fs"
import pluralize from "pluralize"
import { sync } from "pkg-dir"
import createJITI from "jiti"
import { getProjectConfig } from "./config"

export const isFn = (item) => {
  let value = Object.prototype.toString.call(item)
  return ["[object Function]", "[object AsyncFunction]"].includes(value)
}
export const isTsOrJsFile = (file) => {
  return [".ts", ".js"].includes(extname(file))
}

export const isApiFile = (file) => {
  // 判断是不是属于 controller下的js文件
  let root = getProjectRoot()
  let { controllerDirname } = getProjectConfig()
  let fullControllerDirname = resolve(root, controllerDirname)
  if (file.indexOf(fullControllerDirname) == -1) return false
  if (!isTsOrJsFile(file)) return false
  return true
}

/**
 * 列出某个目录下的文件，返回格式
 * {filePath,fileName}
 *
 */
export const listFiles = (currentDirPath) => {
  return fs.readdirSync(currentDirPath).reduce((acc, file) => {
    let filePath = path.resolve(currentDirPath, file)
    let stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      let childFiles = listFiles(filePath)
      return acc.concat(childFiles)
    } else if (stat.isFile()) {
      if (!isTsOrJsFile(file)) return acc
      acc.push({ filePath, fileName: file })
    }
    return acc
  }, [])
}

/**
 * file: D:/Github/Gganbu/src/controller/manage/order.js
 * ---->  manage/orders
 */
export const convertFileToRoute = (file) => {
  const root = getProjectRoot()
  const { controllerDirname } = getProjectConfig()
  let fullControllerDirname = resolve(root, controllerDirname)
  let splitArr = file.split(fullControllerDirname)
  let fileSplit = splitArr[1].split("/")
  let lastItem = fileSplit[fileSplit.length - 1]
  if (isTsOrJsFile(file)) {
    lastItem = lastItem.substring(0, lastItem.indexOf(".")) // 去除js后缀
  }
  fileSplit.splice(fileSplit.length - 1, 1, pluralize(lastItem)) // 替换原来的最后一项
  return fileSplit.join("/")
}

/**
 * 在一体化中，用return 值 来表示 ctx.body
 *
 */
export const mapReturnToCtxBody = (actionFn) => {
  return async function (ctx) {
    let res = await actionFn()
    ctx.body = res
  }
}

/**
 * 根据 package.json 找到项目根目录
 */
export const getProjectRoot = (cwd?: string) => {
  return sync(cwd) || process.cwd()
}

/**
 * 动态require文件 包含所有的了
 */
export const importFile = (filePath: string) => {
  const jiti = createJITI()
  const contents = jiti(filePath)
  // if ("default" in contents) return contents.default
  return contents
}
/**
 * import file 相当于 importFile 的default
 */
export const importFileDefault = (filePath: string) => {
  const contents = importFile(filePath)
  return contents.default || {}
}

/**
 * 判断文件是否存在
 */
export const existFile = (filePath: string) => {
  return existsSync(filePath)
}
