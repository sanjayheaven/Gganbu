import portfinder from "portfinder"

export const checkPort = async (port: number) => {
  return new Promise<number>(async (resolve, reject) => {
    portfinder.getPort({ port: port, stopPort: port + 10 }, (err, port) => {
      if (port) {
        resolve(port)
      }
    })
  })
}
