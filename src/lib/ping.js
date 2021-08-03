export const browserPing = (url) => {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script')
    script.src =  `http://${url}?hash=${Date.now()}`

    const start = Date.now()
    script.onload = () => {
      script.remove()
      resolve(Date.now() - start)
    }
    script.onerror = () => {
      script.remove()
      reject(`Ping request could not find host ${url}. Please check the name and try again.`)
    }
    document.querySelector('body').appendChild(script)
  })
}