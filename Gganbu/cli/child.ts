/**
 * process.send // 监听 发送信息
 * process.on('message') // 监听父进程
 *
 */

/**
 * 子进程 是启动serverde
 */
import { AppStart } from "../model"
;(async () => {
  let startSuccess = false
  try {
    await AppStart()
    startSuccess = true
  } catch (e) {
    console.log(e)
    process.send({
      type: "error",
      message: "start error: " + ((e && e.message) || ""),
    })
  }
  process.send({ type: "started", startSuccess })
})()

// process.on("message", (msg) => {
//   console.log("message from parent:", msg)
// })

// let counter = 0
// setInterval(() => {
//   process.send({ counter: counter++ })
// }, 1000)
