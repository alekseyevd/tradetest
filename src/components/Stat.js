import { useEffect, useRef, useState } from 'react'
import { Statistic } from '../lib/Statistic'
import { once } from '../lib/once'

export const Stat = () => {
  const [values, setValues] = useState([])
  const [isOpened, setOpened] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const ws = useRef(null)
  const stat = useRef(new Statistic())
  const onWsOpened = once(() => setLoading(false))

  const handleStart = () => {
    ws.current = new WebSocket("wss://trade.trademux.net:8800/?password=1234")
    ws.current.onopen = () => {
      setOpened(true)
      setLoading(true)
    }
    ws.current.onclose = () => {
      setOpened(false)
    }
    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data)
      stat.current.set(data.value)
      if (stat.current.size > 100) onWsOpened()
    }
  }

  const handleCalcStatistic = () => {
    const start = Date.now()
    const size = stat.current.size
    const ar = [...stat.current.data.entries()]
    let sum = 0
    let mode = 0
    let maxFreq = 0
    let amount = 0
    let medianPosition = Math.ceil(size / 2)
    let median = 0
    let d = 0
    ar.sort((a,b) => a[0] - b[0])
    for (let i = 0; i < ar.length; i++) {
      sum += ar[i][0]*ar[i][1]
      amount += ar[i][1]
      if (medianPosition < amount && !median) {
        median = ar[i][0]
      } else if (medianPosition === amount && !median) {
        if (size % 2 === 0) {
          median = (ar[i][0] + ar[i+1][0]) / 2
        } else median = ar[i][0]
      }
      if (ar[i][1] > maxFreq) {
        maxFreq = ar[i][1]
        mode = ar[i][0]
      }
    }
    let average = (sum / size).toFixed(2) || 0
    for (let i = 0; i < ar.length; i++) {
      d += Math.pow(ar[i][0] - average, 2)*ar[i][1]
    }
    let deviation = Math.sqrt(d/(size - 1)).toFixed(2) || 0
    let time = Date.now() - start

    setValues([...values, { average, median, mode, deviation, time }])
  }

  useEffect(() => {
    const websocket = ws.current
      return () => {
        if (websocket)
        websocket.close()
      }
  }, [])

  return (
    <div>
      <h2>Trade Stats</h2>
      <div className="buttons_wrapper">
        <button className="button" onClick={handleStart} disabled={isOpened}>start</button>
        {isOpened && isLoading && <span>loading...</span>}
        {isOpened && !isLoading && <button className="button" onClick={handleCalcStatistic}>statistic</button>}
      </div>
      {values.length > 0 && <table>
        <thead>
          <tr>
            <td>Среднее</td>
            <td>Медиана</td>
            <td>Мода</td>
            <td>Отклонение</td>
            <td>Время, мс</td>
          </tr>
        </thead>
        <tbody>
          {
            values.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{item.average}</td>
                  <td>{item.median}</td>
                  <td>{item.mode}</td>
                  <td>{item.deviation}</td>
                  <td>{item.time}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>}
    </div>
  );
}

