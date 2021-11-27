import * as chokidar from "chokidar"
import { join, relative, resolve } from "upath"
import { getProjectConfig } from "../config"
import { getProjectRoot } from "../util"
import { fork } from "child_process"
import { statSync, existsSync } from "fs"
// 状态
let state = {
  restarting: false,
}
let forked
let hasWathched // 是否已经开启 监听
let restartCount = 0
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
    console.log(event, fileName, state.restarting, restartCount)
    if (state.restarting) return true
    state.restarting = true
    restart().then(() => {
      restartCount += 1
      state.restarting = false
      console.log(`变化的文件：${relative(controllerDir, fileName)}`)
    })
  })
}

export const close = async () => {
  console.log("关闭server，kill 进程")
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
    console.log("messsgae from child", msg)
  })
  if (!hasWathched) {
    startWatch()
  }
}
export const restart = async () => {
  console.log("文件变化重新加载")
  await close()
  await start()
}
