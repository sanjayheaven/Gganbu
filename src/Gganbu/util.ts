import path, { extname, resolve, join, toUnix } from "upath"
import fs from "fs"
import pluralize from "pluralize"
import { init, parse } from "es-module-lexer"

const isTsOrJsFile = (file) => {
  return [".ts", ".js"].includes(extname(file))
}

export const isApiFile = (file) => {
  // 判断是不是属于 controller下的js文件
  if (file.indexOf("/src/controller") == -1) return false
  if (!isTsOrJsFile(file)) return false
  return true
}

export const listFiles = (currentDirPath) => {
  return fs.readdirSync(currentDirPath).reduce((acc, file) => {
    let filePath = path.resolve(currentDirPath, file)
    let stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      let childFiles = listFiles(filePath)
      return acc.concat(childFiles)
    } else if (stat.isFile()) {
      if (!isTsOrJsFile(file)) return acc
      acc.push({
        filePath: filePath,
        fileName: file,
      })
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
  console.log(sliceArr)
  let length = sliceArr.length
  let lastItem = sliceArr[length - 1]
  if (isTsOrJsFile(file)) {
    lastItem = lastItem.substring(0, lastItem.indexOf(".")) // 去除js后缀
  }
  sliceArr.splice(length - 1, 1, pluralize(lastItem)) // 替换原来的最后一项
  return sliceArr.join("/")
}

const createApi = (exports, route, client = "'@/Gganbu/request'") => {
  let fns = exports
    .filter((i) => i != "default") // 过滤 export default
    .map((name) => {
      let url = join(route, name)
      let method = (name.startsWith("get") && "GET") || "POST"
      console.log(url, name, typeof url, 1111)
      return `
        export function ${name} (...args){
          return request({
            url:"${url}",
            method: "${method}",
            data:{args}
          })
        }`
    })
    .join("\n")
  return `
      import {request}  from ${client}
      ${fns}
    `
}

export const createApiSDK = async (code, file) => {
  await init
  const [imports, exports] = parse(code)
  let route = convertFileToRoute(file)
  const api = createApi(exports, route)
  return api
}
