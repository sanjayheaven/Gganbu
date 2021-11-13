import { als, useContext } from "./Gganbu/hook"
import koaCompose from "koa-compose"
import { App, createRouter } from "./Gganbu/model"
import middleware from "./src/middleware"
const main = async (app, port) => {
  try {
    app.use((ctx, next) => {
      als.run({ ctx: ctx }, async () => {
        // let ctx = als.getStore()
        let ctx = useContext()
        console.log(ctx, 123344)
        await next()
      }) // sets default values
    })
    // 注册路由
    const Router = await createRouter()
    app.use(koaCompose(Router))
    app.use(koaCompose(middleware))

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
