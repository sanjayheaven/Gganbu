const pro = {
  port: 7007,
}

const dev = {
  port: 7007,
}
const test = {
  port: 7007,
}
const env = process.env.NODE_ENV

module.exports = (() => {
  if (env == "development") {
    return dev
  } else if (env == "test") {
    return test
  } else {
    return pro
  }
})()
