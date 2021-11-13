async function logger(ctx, next) {
  console.log(`当前请求路由: ${ctx.url}`)
  await next()
}

// 错误处理 中间件 前置部分
async function errorHandling(ctx, next) {
  try {
    process.on("unhandledRejection", function (err, promise) {
      console.log("/监听Promise没有被捕获的失败函数")
      console.log("UnhandledPromiseRejectionWarning 会导致node崩溃")
    })
    await next()
  } catch (error) {
    console.log(error, 111)
    let { name, code, message, message_en } = error
    ctx.error = error
    ctx.status = code || 500
    let payload = {}
    payload["error"] = name || "Internal Server Error"
    payload["code"] = code || 500
    payload["message"] = message || "Internal Server Error"
    payload["message_en"] = message_en || "Internal Server Error"
    console.log(payload, "看看捕捉到的错误")
    ctx.body = payload
  }
}

// 字符串解析
import bodyParser from "koa-bodyparser"

// 处理跨域
import cors from "koa2-cors"

export default [logger, errorHandling, bodyParser(), cors()]
