const http = require("http")
const { AsyncLocalStorage } = require("async_hooks")

const asyncLocalStorage = new AsyncLocalStorage()

function logWithId(msg) {
  const id = asyncLocalStorage.getStore()
  console.log(`${id !== undefined ? id : "-"}:`, msg)
}

let idSeq = 0
http
  .createServer((req, res) => {
    asyncLocalStorage.run(idSeq++, () => {
      logWithId("start")
      // Imagine any chain of async operations here
      setImmediate(() => {
        logWithId("finish")
        res.end()
      })
    })
  })
  .listen(8900)

http.get("http://localhost:8900")
http.get("http://localhost:8900")
// Prints:
//   0: start
//   1: start
//   0: finish
//   1: finish
