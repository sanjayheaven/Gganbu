/**
 * process.send // 监听 发送信息
 * process.on('message') // 监听父进程
 *
 */

/**
 * 子进程 启动server
 */
const createJiti = require("jiti")
let jiti = createJiti(process.cwd(), { cache: false })

const APPPATH = process.env.APPPATH
const { AppStart } = jiti(APPPATH)

;(async () => {
  let startSuccess = false
  try {
    // 出现问题，端口不匹配
    await AppStart()
    startSuccess = true
  } catch (e) {
    console.log(e, 122333)
    process.send({
      type: "error",
      message: "start error: " + ((e && e.message) || ""),
    })
  }
  process.send({ type: "started", startSuccess })
})()
