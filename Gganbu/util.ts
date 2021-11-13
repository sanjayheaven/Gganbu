import path, { extname, resolve, join, toUnix } from "upath"
import fs from "fs"
import pluralize from "pluralize"

const isTsOrJsFile = (file) => {
  return [".ts", ".js"].includes(extname(file))
}

export const isApiFile = (file) => {
  // 判断是不是属于 controller下的js文件
  if (file.indexOf("/src/controller") == -1) return false
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
  let splitArr = file.split("/")
  let sliceArr = splitArr.slice(splitArr.indexOf("controller") + 1)
  let length = sliceArr.length
  let lastItem = sliceArr[length - 1]
  if (isTsOrJsFile(file)) {
    lastItem = lastItem.substring(0, lastItem.indexOf(".")) // 去除js后缀
  }
  sliceArr.splice(length - 1, 1, pluralize(lastItem)) // 替换原来的最后一项
  return sliceArr.join("/")
}

/**
 * 在一体化中，用return 值 来表示 ctx.body
 *
 */
export const mapReturnToCtxBody = function (actionFn) {
  return async function (ctx) {
    // console.log(ctx.url, "看看action请求的url")
    let res = await actionFn()
    ctx.body = res
  }
}
