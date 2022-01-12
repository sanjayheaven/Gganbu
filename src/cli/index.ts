import * as chokidar from "chokidar"
import { join, relative, resolve } from "upath"
import { getResolvedSrcDir } from "../config"
import { getProjectRoot } from "../util"
import { fork } from "child_process"
import { statSync, existsSync } from "fs"
import Spin from "light-spinner"
import { ProcessMessage } from "../types/cli"
import { checkPort } from "./util"
import { ProjectConfig } from "../types/config"
import { getProjectConfig, wrappedProjectConfig } from ".."
const Spinner = new Spin({ text: "Gganbu Starting" })

// 状态库
let state = {
  restarting: false,
  hasStarted: false, // 是否启动过 // 标价区分 第一次和重启的区别
  // 这里重启标记 不能在 restart之后标记，事件循环机制不能及时更新，要在forked on message 之后标记为false。
  hasWatched: false, // 是否开启过监听
  initPort: 0,
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
      console.log(`[ Gganbu ] Auto reload. ${eventPath}`)
    })
  })
}

export const close = async () => {
  Spinner.stop()
  if (forked?.kill) {
    await forked.kill()
  }
  forked = null
  state.hasStarted = false
}

export const start = async () => {
  let projectConfig = getProjectConfig()
  let { port } = projectConfig

  console.log(projectConfig, 1234)
  // 先解决，重复利用端口，不然端口一直上升，最后看下为什么不能等待关闭，一直是一个端口
  state.initPort = (!state.initPort && port) || state.initPort
  let checkedPort
  if (!state.hasStarted) {
    // 第一次启动 需要检测端口
    checkedPort = await checkPort(state.initPort)
    if (checkedPort != port) {
      console.log(
        `[ Gganbu ] Server Port ${port} is in use. Now using port ${checkedPort}`
      )
    }
    // 重写
    wrappedProjectConfig.getConfig = (): ProjectConfig => {
      return { ...projectConfig, port: checkedPort }
    }
  }
  if (!state.hasWatched) {
    startWatch()
  }
  let childPath = join(__dirname, "./childModule")
  let MODELPATH = resolve(__dirname, "../model")
  return new Promise<void>(async (resolve) => {
    Spinner.start()
    forked = fork(childPath, [], {
      cwd: getProjectRoot(),
      env: { MODELPATH, SERVERPORT: checkedPort },
    })
    forked.on("message", (msg: ProcessMessage) => {
      if (msg.type == "started") {
        state.hasStarted = true
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
}

export const run = async () => {
  process.on("exit", () => close())
  // process.on("SIGINT", () => close())
  if (state.hasStarted) {
    console.log("server 已启动")
    return
  }
  return start()
}
