// 请求body 解析成对象
import bodyParser from "koa-bodyparser"

// 处理跨域
import cors from "koa2-cors"

async function logger(ctx, next) {
  console.log(`请求路由: ${ctx.url}`)
  await next()
  console.log("请求返回值：", ctx.body, ctx.request.body)
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
    payload["message"] = message || "服务器信息获取错误"
    payload["message_en"] = message_en || "Internal Server Error"
    console.log(payload, "看看捕捉到的错误")
    ctx.body = payload
  }
}

// export default [logger, errorHandling, bodyParser(), cors()]
export default [bodyParser(), cors()]
