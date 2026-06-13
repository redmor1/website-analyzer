import { spawn } from "node:child_process"

export function spawnPromise(
  command: string,
  arguments_: string[],
): Promise<void> {
  return new Promise((resolve, reject) => {
    // spawns the child process and executes it, stdio set to ignore so it doesn't fill the RAM
    const childProcess = spawn(command, arguments_, {
      stdio: "ignore",
    })

    // listens to the child process "close" event
    childProcess.on("close", (code) => {
      // code 0 means process finished succesfully
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Spawn process exited with code: ${String(code)}`))
      }
    })

    // listen to the child process "error event"
    childProcess.on("error", (error) => {
      reject(new Error(`Spawn process errored with ${error.message}`))
    })
  })
}
