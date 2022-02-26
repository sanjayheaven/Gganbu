import { listFiles, importFile } from "../utils"
import { getResolvedServiceDir } from "../config"
import { Service } from "../types/service"

/**
 * 获取服务，面向服务，单个函数代表一个服务
 */
export const getServices = (): Service[] => {
  let resolvedServiceDir = getResolvedServiceDir()
  let files = listFiles(resolvedServiceDir)
  return files.map((file) => {
    return { ...file, exports: importFile(file.filePath) }
  })
}
