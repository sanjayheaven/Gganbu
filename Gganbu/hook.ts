import alshooks from "async_hooks"
console.log(alshooks)
let AsyncLocalStorage = alshooks.AsyncLocalStorage

export const als = new AsyncLocalStorage()

export const useContext = () => {
  return als.getStore()["ctx"]
}

// als 中间件注册
// app.use((ctx, next) => {
//   als.run({ ctx: ctx }, async () => {
//     // let ctx = als.getStore()
//     let ctx = useContext()
//     console.log(ctx, 123344)
//     await next()
//   }) // sets default values
// })
