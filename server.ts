import { als, useContext } from "./Gganbu/hook"
import koaCompose from "koa-compose"
import { App, createRouter } from "./Gganbu/model"
import middleware from "./src/middleware"

const main = async (app, port) => {
  const Router = await createRouter()
  // console.log(Router)
  try {
    app.use(async (ctx, next) => {
      await als.run({ ctx: ctx }, async () => {})
      await next()
    })
    // 中间件注册
    app.use(koaCompose([...middleware]))

    // 注册路由
    app.use(koaCompose(Router))
    // 启动
    const server = app.listen(port, () =>
      console.log(`项目启动, 端口：${port}, 环境：${process.env.NODE_ENV}`)
    )

    // pm2 平滑更新
    process.on("SIGINT", () => {
      server.keepAliveTimeout = 1
      server.close(() => {
        process.exit(0)
      })
    })
  } catch (err) {
    console.log(err)
  }
}
main(App, 7007)
