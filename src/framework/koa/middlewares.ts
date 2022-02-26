// 请求body 解析成对象
import bodyParser from "koa-bodyparser"

// 处理跨域
import cors from "koa2-cors"

export default [bodyParser(), cors()]
