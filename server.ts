import { AppStart } from "./Gganbu/model"
import { importFile, importFileDefault } from "./Gganbu/util"
// AppStart()

// import createRequire from "create-require"
import { createRequire } from "module"
// const require1 = createRequire(import.meta.url)
// let content = createRequire("D:/Github/Gganbu/src/api/order.js")
let require1 = createRequire("D:/Github/Gganbu/src/api/manage/order.ts")
let contents = require1("D:/Github/Gganbu/src/api/manage/order.ts")
console.log(contents, "内容！！！！！！！！！！！！")
