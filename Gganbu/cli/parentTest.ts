const { fork } = require("child_process")
const child = fork("./child")
child.on("message", (msg) => {
  console.log("messsgae from child", msg)
})

child.send({ hello: "world" })
