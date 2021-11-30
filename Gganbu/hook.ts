import alshooks from "async_hooks"
let AsyncLocalStorage = alshooks.AsyncLocalStorage

export const als = new AsyncLocalStorage()

export const useContext = () => {
  let store = als.getStore()
  console.log(store, 1234442222, "hook")
  return (als.getStore() || {})["ctx"]
}
export const useConfig = () => {
  return als.getStore()["config"]
}
