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
 const MODELPATH = process.env.MODELPATH // 新建子进程的时候 创建的。
 const SERVERPORT = process.env.SERVERPORT
 const { AppStart } = jiti(MODELPATH)
 
 ;(async () => {
   let startSuccess = false
   try {
     await AppStart({ port: SERVERPORT })
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
 