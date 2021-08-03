import { useState } from "react"
import { browserPing } from "../lib/ping"

export const Ping = () => {
  const [url, setUrl] = useState('')
  const [errorMesage, setError] = useState('')
  const [value, setValue] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleStart = async (url) => {
    setError(false)
    setLoading(true)
    try {
      const value = await browserPing(url)
      setValue(value)
    } catch (error) {
      setError(error)
    }finally {
      setLoading(false)
    }
  }

  const urlChange = (e) => {
    setUrl(e.target.value)
    setValue(null)
  }

  return (
    <div>
      <div>
        <h2>Browser ping</h2>
        <input className="input" value={url} onChange={urlChange}></input>
        <button className="button" onClick={() => handleStart(url)} disabled={url.length === 0}>Start!</button>
      </div>
      <div>
        {
          loading && <div>start pinging {url}...</div>
        }
        { errorMesage && <div>{errorMesage}</div> }
        { value && <div>ping time - {value} ms</div>}
      </div>
    </div>
  )
}
