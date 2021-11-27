import * as chokidar from "chokidar"
import { join, relative } from "upath"
import { getProjectConfig } from "../config"
import { getProjectRoot } from "../util"
import { fork } from "child_process"
import { statSync, existsSync } from "fs"
import { AppClose } from "../model"
// 状态
let state = {
  restarting: false,
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
    ignored: (path) => {
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
    ignoreInitial: true,
  })
  watcher.on("all", (event, path) => {
    if (state.restarting) return true
    restart().then(() => {
      console.log(`重新加载.  ${relative(controllerDir, path)}`)
    })
  })
}

export const close = async () => {
  console.log("关闭进程")
  if (forked?.kill) {
    forked.kill()
  }
  forked = null
}
export const start = async () => {
  // 新开一个进程用来启动 AppStart
  forked = fork("./child")
  forked.on("message", (msg) => {
    console.log("messsgae from child", msg)
  })
  if (!hasWathched) {
    console.log("开启监听")
    startWatch()
  }
}
export const restart = async () => {
  console.log("重新加载")
  await close()
  await start()
}
start()
