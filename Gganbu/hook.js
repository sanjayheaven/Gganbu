import alshooks from "async_hooks"
console.log(alshooks)
let AsyncLocalStorage = alshooks.AsyncLocalStorage

export const als = new AsyncLocalStorage()

export const useContext = () => {
  return als.getStore("ctx")
}
