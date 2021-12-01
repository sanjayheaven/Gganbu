import * as chokidar from "chokidar"
import { join, relative, resolve } from "upath"
import { getResolvedSrcDir } from "../config"
import { getProjectRoot } from "../util"
import { fork } from "child_process"
import { statSync, existsSync } from "fs"
import Spin from "light-spinner"
import * as chalk from "chalk"
import { ProcessMessage } from "../types/cli"
const Spinner = new Spin({ text: "Gganbu Starting" })

// 状态库
let state = {
  restarting: false,
  hasStarted: false, // 是否启动过 // 标价区分 第一次和重启的区别
  // 这里重启标记 不能在 restart之后标记，事件循环机制不能及时更新，要在forked on message 之后标记为false。
  hasWatched: false, // 是否开启过监听
}

let forked

export const startWatch = () => {
  let resolvedSrcDir = getResolvedSrcDir()
  const watchAllowExts = [].concat(".ts")
  
  const watcher = chokidar.watch(resolvedSrcDir, {
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
  state.hasWatched = true
  watcher.on("all", (event, fileName) => {
    if (state.restarting) return true
    state.restarting = true
    restart().then(() => {
      let eventPath = `[${event}] ${relative(resolvedSrcDir, fileName)}`
      console.log(`[ Gganbu ] Auto reload. ${chalk.hex("#666666")(eventPath)}`)
    })
  })
}

export const close = async () => {
  Spinner.stop()

  if (forked?.kill) {
    forked.kill()
  }
  forked = null
}
export const start = async () => {
  if (!state.hasWatched) {
    startWatch()
  }
  let childPath = join(__dirname, "./childModule")
  let MODELPATH = resolve(__dirname, "../model")
  return new Promise<void>(async (resolve) => {
    Spinner.start()
    forked = fork(childPath, [], {
      cwd: getProjectRoot(),
      env: {
        MODELPATH,
      },
    })
    forked.on("message", (msg: ProcessMessage) => {
      if (msg.type == "started") {
        state.hasStarted = true // 启动过一次 第一次
        Spinner.stop()
        state.restarting = false
      }
      resolve()
    })
  })
}

export const restart = async () => {
  await close()
  await start()

  // return new Promise(() => {})
}
