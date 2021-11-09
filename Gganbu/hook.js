const { AsyncLocalStorage } = require("async_hooks")
export const als = new AsyncLocalStorage()

export const useContext = () => {
  return als.getStore("ctx")
}
