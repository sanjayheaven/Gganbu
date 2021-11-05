const { AsyncLocalStorage } = require("async_hooks")
const als = new AsyncLocalStorage()

const useContext = () => {
  return als.getStore("ctx")
}

module.exports = {
  useContext,
  als,
}
