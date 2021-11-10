export default function myPlugin() {
  const virtualFileId = "@my-virtual-file"

  return {
    name: "my-plugin", // 必须的，将会在 warning 和 error 中显示
    resolveId(id) {
      if (id === virtualFileId) {
        return virtualFileId
      }
    },
    load(id) {
      if (id === virtualFileId) {
        return `export const msg = "@Gganbu/vite-plugin-model"`
      }
    },
  }
}
