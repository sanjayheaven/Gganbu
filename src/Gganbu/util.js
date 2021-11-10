import path, { extname, resolve, join, toUnix } from "upath"
import fs from "fs"
import pluralize from "pluralize"
import { init, parse } from "es-module-lexer"

export const listFiles = (currentDirPath) => {
  return fs.readdirSync(currentDirPath).reduce((acc, file) => {
    let filePath = path.resolve(currentDirPath, file)
    let stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      let childFiles = listFiles(filePath)
      return acc.concat(childFiles)
    } else if (stat.isFile()) {
      let extname = path.extname(file)
      if (extname != ".js") return acc
      acc.push({
        filePath: filePath,
        fileName: file,
      })
    }
    return acc
  }, [])
}

export const convertFileToRoute = (file) => {
  // D:/Github/Gganbu/src/controller/manage/order.js
  // --->  manage/orders
  let splitArr = file.split("/")
  let sliceArr = splitArr.slice(splitArr.indexOf("controller") + 1)
  console.log(sliceArr)
  let length = sliceArr.length
  let lastItem = sliceArr[length - 1]
  if (extname(lastItem) === ".js") {
    lastItem = lastItem.substring(0, lastItem.indexOf(".")) // 去除js后缀
  }
  lastItem
  sliceArr.splice(length - 1, 1, pluralize(lastItem)) // 替换原来的最后一项
  return sliceArr.join("/")
}

const createApi = (exports, route, client = "'@/Gganbu/request'") => {
  let fns = exports
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

  // D:/Github/Gganbu/src/controller/manage/order.js
  // --->  manage/orders
  let route = convertFileToRoute(file)

  const api = createApi(exports, route)

  return api
}

export const isApiFile = (file) => {
  // 判断是不是属于 controller下的js文件
  if (file.indexOf("/src/controller") == -1) return false
  if (extname(file) !== ".js") {
    return false
  }
  return true
}
