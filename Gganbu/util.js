import path, { extname, resolve, join, toUnix } from "upath"
import fs from "fs"
import pluralize from "pluralize"

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