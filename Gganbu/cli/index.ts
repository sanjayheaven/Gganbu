import * as chokidar from "chokidar"
import { join, relative, resolve } from "upath"
import { getProjectConfig } from "../config"
import { getProjectRoot } from "../util"
import { fork } from "child_process"
import { statSync, existsSync } from "fs"
import ora from "ora" // 控制台交互 终端转轮

const spinner = ora("Loading unicorns").start()

// 状态
let state = {
  restarting: false,
  // 这里重启标记 不能在 restart之后标记，事件循环机制不能及时更新，要在forked on message 之后标记为false。
}
let forked
let hasWathched // 是否已经开启 监听

export const startWatch = () => {
  let root = getProjectRoot()
  let serverConfig = getProjectConfig()
  let { controllerDirname } = serverConfig
  let controllerDir = join(root, controllerDirname)

  const watchAllowExts = [].concat(".ts")

  const watcher = chokidar.watch(controllerDir, {
    ignored: (path, fsStats) => {
      if (path.includes("node_modules")) {
        return true
      }
      if (existsSync(path)) {
        const stat = statSync(path)
        if (stat.isFile()) {
          const matchExts = watchAllowExts.find((ext) => path.endsWith(ext))
          if (!matchExts) return true
        }
      }
    }, // ignore dotfiles
    persistent: true,
    ignoreInitial: true, // 初始加载文件算一次变化，这个必须关掉。不管就是多少文件就有多少变化
  })
  watcher.on("all", (event, fileName) => {
    if (state.restarting) return true
    state.restarting = true
    restart().then(() => {
      console.log(`事件：${event}, 文件：${relative(controllerDir, fileName)}`)
    })
  })
}

export const close = async () => {
  if (forked?.kill) {
    forked.kill()
  }
  forked = null
}
export const start = async () => {
  // 新开一个进程用来启动 AppStart
  let childPath = join(__dirname, "./childModule")
  let MODELPATH = resolve(__dirname, "../model")
  forked = fork(childPath, [], {
    cwd: getProjectRoot(),
    env: {
      MODELPATH,
    },
  })
  forked.on("message", (msg) => {
    if (msg.type == "started") {
      state.restarting = false
      console.log("重启成功")
    }
  })
  if (!hasWathched) {
    startWatch()
  }
}
export const restart = async () => {
  await close()
  await start()
}
