import path, { extname } from "upath"
import fs, { existsSync } from "fs"
import pluralize from "pluralize"
import { sync } from "pkg-dir"
import createJITI from "jiti"
import { getResolvedServiceDir } from "../config/index"
import { Service } from "../service/type"
import { ControllerAction } from "../types/model"
import { getResolvedSrcDir } from "gganbu"

const jiti = createJITI(process.cwd(), { cache: false })

export const isFn = (item: any) => {
  return typeof item === "function"
}
export const isTsOrJsFile = (file: string) => {
  return [".ts", ".js"].includes(extname(file))
}

/**
 * 判断是不是属于 service下的js文件
 * 存在这种情况 D:/Github/Gganbu/src/api/manage/order.ts?t=1637686059242
 */
export const isApiFile = (file: string) => {
  let resolvedControllerDir = getResolvedServiceDir()
  if (file.indexOf(resolvedControllerDir) == -1) return false
  if (!isTsOrJsFile(file)) return false
  return true
}

/**
 * 列出某个目录下的文件，返回格式
 * {filePath,fileName}
 * fileName: 示例：order.ts
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
 * 列出某个服务的文件，仅限第一层目录以及第一层的文件
 */
export const listServiceFiles = (currentDirPath): Service[] => {
  return fs.readdirSync(currentDirPath).reduce((acc: Service[], file) => {
    let filePath = path.resolve(currentDirPath, file)
    let stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      let indexFile = path.resolve(filePath, "index.ts")
      acc.push({ filePath: indexFile, fileName: file })
    } else {
      if (!isTsOrJsFile(file)) return acc
      let indexFile = path.resolve(filePath)
      acc.push({ filePath: indexFile, fileName: file })
    }
    return acc
  }, [])
}

/**
 * file: D:/Github/Gganbu/src/api/manage/order.js
 * ---->  /api/manage/orders 1.2.x 修改
 */
export const convertFileToRoute = (file: string) => {
  let resolvedSrcDir = getResolvedSrcDir() // /src
  let splitArr = file.split(resolvedSrcDir)
  let fileSplit = splitArr[1].split("/") // [api,manage,order.js]
  let lastItem = fileSplit[fileSplit.length - 1]
  if (isTsOrJsFile(file)) {
    lastItem = lastItem.substring(0, lastItem.indexOf(".")) // 去除js后缀
  }
  fileSplit.splice(fileSplit.length - 1, 1, pluralize(lastItem)) // 替换原来的最后一项
  return fileSplit.join("/")
}

/**
 * 根据 package.json 找到项目根目录
 */
export const getProjectRoot = (cwd?: string) => {
  return sync(cwd) || process.cwd()
}

/**
 * 动态require文件 包含所有的了 文件只能读取一次 所以需要加一个缓存了
 */
export const importFile = (filePath: string) => {
  const contents = jiti(filePath)
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
